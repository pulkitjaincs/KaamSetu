import { InputField, SelectField } from '@/components/common/FormComponents';

interface FinishFormData { expectedSalaryMin?: string; expectedSalaryMax?: string; expectedSalaryType?: string; aadhaarNumber?: string; panNumber?: string; licenseNumber?: string; [key: string]: unknown; }
export default function EditProfile_Finish({ formData, handleChange, setValues }: { formData: FinishFormData; handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; setValues: (v: FinishFormData) => void }) {
    return (
        <div>
            <h4 className="font-bold mb-4" style={{ color: 'var(--text-main)' }}>Almost done!</h4>

            <p className="font-semibold mb-1" style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Expected Salary</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div>
                    <InputField name="expectedSalaryMin" value={formData.expectedSalaryMin} onChange={handleChange} type="number" placeholder="Min ₹" />
                </div>
                <div>
                    <InputField name="expectedSalaryMax" value={formData.expectedSalaryMax} onChange={handleChange} type="number" placeholder="Max ₹ (optional)" />
                </div>
                <div>
                    <SelectField
                        name="expectedSalaryType"
                        value={formData.expectedSalaryType}
                        onChange={handleChange}
                        options={[
                            { label: '/ Month', value: 'monthly' },
                            { label: '/ Day', value: 'daily' }
                        ]}
                    />
                </div>
            </div>

            <p className="font-semibold mb-1" style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                Identity Documents <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <InputField
                        name="aadhaarNumber"
                        value={formData.aadhaarNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValues({ ...formData, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                        maxLength={12}
                        placeholder="Aadhaar (12 digits)"
                    />
                </div>
                <div>
                    <InputField
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange}
                        maxLength={10}
                        style={{ textTransform: 'uppercase' }}
                        placeholder="PAN Number"
                    />
                </div>
                <div>
                    <InputField
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        style={{ textTransform: 'uppercase' }}
                        placeholder="Driving License"
                    />
                </div>
            </div>
        </div>
    );
}
