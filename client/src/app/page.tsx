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
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

  // IntersectionObserver-based infinite scroll
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
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

  const listColumnClass = selectedJob
    ? "d-none d-lg-flex col-lg-5"
    : "col-12";

  const detailColumnClass = selectedJob
    ? "col-12 col-lg-7"
    : "d-none";

  const handleHeroSearch = ({ search, location, category }: { search?: string, location?: string, category?: string }) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    if (category && category !== 'All') params.set('category', category);
    router.push(`/?${params.toString()}`);
  };

  if (isError) return (
    <div className="text-center py-5 mt-5">
      <i className="bi bi-exclamation-circle text-danger fs-1"></i>
      <h5 className="mt-3">Failed to load jobs</h5>
      <button className="btn btn-primary mt-2" onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  // Section header label
  const sectionTitle = (searchQuery || locationQuery || categoryQuery)
    ? `Results${searchQuery ? ` for "${searchQuery}"` : ''}${locationQuery ? ` in ${locationQuery}` : ''}`
    : 'Opportunities';

  return (
    <PageTransitions>
      <div className="container-fluid flex-grow-1 px-4 px-lg-5" style={{ maxWidth: "1400px" }}>

        <SearchHero
          onSearch={handleHeroSearch}
          initialSearchQuery={searchQuery}
          initialLocation={locationQuery}
          initialCategory={categoryQuery}
        />

        <div className="row g-4" style={{ paddingTop: '0px' }}>

          <div className={`${listColumnClass} d-flex flex-column layout-transition`}
            style={{ paddingTop: "0px", paddingBottom: "20px" }}>

            {/* Section header — Stitch "Premium Opportunities / See All" style */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '32px 0 24px 0',
              }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text-main)',
                margin: 0,
              }}>
                {sectionTitle}
              </h3>
              {!selectedJob && allJobs.length > 0 && (
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0056b6',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                >
                  See All <i className="bi bi-arrow-right" style={{ fontSize: '0.85rem' }}></i>
                </button>
              )}
            </div>

            {/* Job cards grid or list */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: selectedJob ? '1fr' : 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
                      gap: '20px',
                    }}
                  >
                    {[...Array(4)].map((_, i) => (
                      <JobSkeleton key={`skeleton-${i}`} />
                    ))}
                  </motion.div>
                ) : allJobs.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="py-5 text-center d-flex flex-column align-items-center"
                  >
                    <div className="p-4 rounded-circle mb-3 mb-4" style={{ background: "var(--bg-surface)" }}>
                      <i className="bi bi-search fs-1" style={{ color: "var(--text-muted)" }}></i>
                    </div>
                    <h5 className="fw-bold mb-2">No jobs found</h5>
                    <p className="text-muted" style={{ maxWidth: "300px" }}>Try adjusting your search filters or exploring a different category.</p>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.08 }
                        }
                      }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: selectedJob ? '1fr' : 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
                        gap: '20px',
                      }}
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
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: selectedJob ? '1fr' : 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
                        gap: '20px',
                        paddingTop: '20px',
                      }}>
                        <JobSkeleton />
                      </div>
                    )}
                    {!hasNextPage && allJobs.length > 0 && (
                      <div className="py-4 text-center border-top mt-3" style={{ borderColor: "var(--border-color)", opacity: 0.7 }}>
                        <span className="small fw-medium" style={{ color: "var(--text-muted)" }}>You&apos;ve reached the end of the list</span>
                      </div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className={`${detailColumnClass} layout-transition`}
            style={{ position: 'sticky', height: "calc(100vh - 120px)", overflowY: "hidden", top: "110px", borderRadius: "24px", zIndex: 1100 }}>
            {selectedJob && (
              <Suspense fallback={<div className="h-100 d-flex align-items-center justify-content-center text-muted">Loading Details...</div>}>
                <Listing
                  job={selectedJob}
                  onClose={() => { setSelectedJob(null); setIsSwitch(false); }}
                  isSwitch={isSwitch}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </PageTransitions>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="py-5 text-center"><div className="spinner-border text-primary" role="status"></div></div>}>
      <HomePageContent />
    </Suspense>
  );
}
