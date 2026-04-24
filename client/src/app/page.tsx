"use client";

import { useState, useEffect, useRef, Suspense, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteJobs } from "@/hooks/queries/useInfiniteJobs";
import SearchHero from "@/components/common/SearchHero";
import PageTransitions from "@/components/common/PageTransitions";
import JobCard from "@/components/common/Card";
import JobSkeleton from "@/components/common/JobSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowRight, Search } from "lucide-react";
import { Job, PaginatedJobsResponse } from "@/types";

const Listing = dynamic(() => import("@/components/common/Listing"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

function HomePageContent() {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSwitch, setIsSwitch] = useState(false);
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openJobId = searchParams.get("openJob");
  const searchQuery = searchParams.get('search') || '';
  const locationQuery = searchParams.get('location') || '';
  const categoryQuery = searchParams.get('category') || '';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteJobs({
    search: searchQuery,
    location: locationQuery,
    category: categoryQuery
  });

  useEffect(() => {
    if (searchQuery && locationQuery) {
      document.title = `${searchQuery} in ${locationQuery} | SkillAnchor`;
    } else if (searchQuery) {
      document.title = `${searchQuery} Jobs | SkillAnchor`;
    } else if (categoryQuery && categoryQuery !== 'All') {
      document.title = `${categoryQuery} Jobs | SkillAnchor`;
    } else {
      document.title = 'SkillAnchor | Better Jobs, Faster';
    }
  }, [searchQuery, locationQuery, categoryQuery]);

  const allJobs = useMemo(() => {
    return data?.pages.flatMap((page: PaginatedJobsResponse) => page.jobs) || [];
  }, [data]);

  // Callback ref for infinite scroll — fires exactly when sentinel mounts/unmounts,
  // avoiding the AnimatePresence mode="wait" timing race with useEffect.
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (!node || !hasNextPage || isFetchingNextPage) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '400px' }
    );
    observerRef.current.observe(node);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (openJobId && allJobs.length > 0) {
      const job = allJobs.find((j: Job) => j._id === openJobId);
      if (job) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedJob(job);
      }
    }
  }, [openJobId, allJobs]);

  const handleJobClick = useCallback((job: Job) => {
    if (selectedJob !== null && selectedJob._id !== job._id) {
      setIsSwitch(true);
    } else {
      setIsSwitch(false);
    }
    setSelectedJob(job);
  }, [selectedJob]);



  const handleHeroSearch = ({ search, location, category }: { search?: string, location?: string, category?: string }) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    if (category && category !== 'All') params.set('category', category);
    router.push(`/?${params.toString()}`);
  };

  if (isError) return (
    <div className="text-center py-20 mt-20">
      <AlertCircle className="text-red-500 mx-auto" size={36} />
      <h5 className="mt-3">Failed to load jobs</h5>
      <button 
        className="mt-4 px-6 py-2.5 rounded-xl font-semibold transition-opacity hover:opacity-90" 
        style={{ background: 'var(--primary-main)', color: 'var(--on-primary)' }} 
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );

  // Section header label
  const sectionTitle = (searchQuery || locationQuery || categoryQuery)
    ? `Results${searchQuery ? ` for "${searchQuery}"` : ''}${locationQuery ? ` in ${locationQuery}` : ''}`
    : 'Opportunities';

  return (
    <>
      <PageTransitions>
        <div className="page-container grow">
          <SearchHero
            onSearch={handleHeroSearch}
            initialSearchQuery={searchQuery}
            initialLocation={locationQuery}
            initialCategory={categoryQuery}
          />

          <div className="flex flex-col lg:flex-row gap-8 items-start relative min-h-[600px] mt-8">
            {/* Left Column: Job Cards */}
            <motion.div 
              layout
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full flex flex-col ${selectedJob ? 'lg:w-[40%]' : 'w-full'}`}
            >
              {/* Section header */}
              <div className="section-header !mb-6">
                <h3 className="section-title">
                  {sectionTitle}
                </h3>
                {!selectedJob && allJobs.length > 0 && (
                  <button className="text-link">
                    See All <ArrowRight size={14} />
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="skeleton-grid" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`job-grid ${selectedJob ? 'grid-cols-single' : 'grid-cols-dynamic'}`}
                  >
                    {[...Array(4)].map((_, i) => (
                      <JobSkeleton key={`skeleton-${i}`} />
                    ))}
                  </motion.div>
                ) : allJobs.length === 0 ? (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full py-20 text-center"
                  >
                    <div className="p-4 rounded-full mb-4 mx-auto w-fit" style={{ background: "var(--bg-surface)" }}>
                      <Search className="text-[var(--text-muted)]" size={36} />
                    </div>
                    <h5 className="font-bold mb-2">No jobs found</h5>
                    <p className="text-[var(--text-muted)]">Try adjusting your filters or search terms.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="job-list-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      layout="position"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.04 }
                        }
                      }}
                      className={`job-grid ${selectedJob ? 'grid-cols-single' : 'grid-cols-dynamic'}`}
                    >
                      {allJobs.map((job: Job) => (
                        <JobCard
                          key={job._id}
                          job={job}
                          isSelected={selectedJob?._id === job._id}
                          onClick={() => handleJobClick(job)}
                        />
                      ))}
                    </motion.div>

                    {/* Sentinel element — triggers fetchNextPage when scrolled into view */}
                    <div ref={loadMoreRef} style={{ height: '1px' }} />

                    {isFetchingNextPage && (
                      <div className={`job-grid pt-5 ${selectedJob ? 'grid-cols-single' : 'grid-cols-dynamic'}`}>
                        <JobSkeleton />
                      </div>
                    )}
                    {!hasNextPage && allJobs.length > 0 && (
                      <div className="py-4 text-center border-t mt-3" style={{ borderColor: "var(--border-color)", opacity: 0.7 }}>
                        <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>You&apos;ve reached the end of the list</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right Column: Listing Detail */}
            <AnimatePresence mode="wait">
              {selectedJob && (
                <motion.div 
                  key="listing-panel"
                  layout
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                  className="hidden lg:block lg:w-[60%] sticky h-[calc(100vh-120px)] overflow-hidden top-[110px] rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl"
                >
                  <Suspense fallback={<div className="h-full flex items-center justify-center text-[var(--text-muted)]">Loading Details...</div>}>
                    <Listing
                      job={selectedJob}
                      onClose={() => { setSelectedJob(null); setIsSwitch(false); }}
                      isSwitch={isSwitch}
                    />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </PageTransitions>
    
    {/* Mobile Listing Bottom Sheet - Outside constrained containers & transitions */}
    {isMobile && selectedJob && (
      <div className="lg:hidden fixed inset-0 z-[2000] flex flex-col justify-end pointer-events-none">
        <Suspense fallback={null}>
          <Listing
            job={selectedJob}
            onClose={() => { setSelectedJob(null); setIsSwitch(false); }}
            isSwitch={isSwitch}
          />
        </Suspense>
      </div>
    )}
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><div className="animate-spin rounded-full border-4 border-[var(--border-color)] border-t-[var(--primary-500)] w-8 h-8 mx-auto" role="status"></div></div>}>
      <HomePageContent />
    </Suspense>
  );
}
