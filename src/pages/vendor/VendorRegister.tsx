import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, Eye, EyeOff, Loader2, CheckCircle,  } from 'lucide-react';
import { supabase } from "../../lib/supabase";


const vendorSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  ownerFullName: z.string().min(2, 'Owner name must be Full name'),
  email: z.string().email('Please enter a valid  new email address you have never used before on this website'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  agreeToTerms: z.boolean()
  .refine((val) => val === true, {
    message: "You must accept TalkToShop terms & conditions",
  }),

});

type VendorFormData = z.infer<typeof vendorSchema>;

const VendorRegister: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cacFile, setCacFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    mode: 'onChange',
  });

  const agreeToTerms = watch('agreeToTerms');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setFileError('Please upload a PDF, JPG, or PNG file');
        return;
      }

      if (file.size > maxSize) {
        setFileError('File size must be less than 5MB');
        return;
      }

      setCacFile(file);
    }
  };

const onSubmit = async (data: VendorFormData) => {
  if (!cacFile) {
    setFileError("Please upload your CAC certificate");
    return;
  }

  setIsSubmitting(true);

  try {
    //  SIGN UP VENDOR
    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

    if (signUpError) throw signUpError;

    //  GET AUTH USER (CRITICAL STEP)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated yet");
    }

    //  UPLOAD CAC FILE (NOW AUTH EXISTS)
    const filePath = `cac/${user.id}.${cacFile.name.split(".").pop()}`;

    const { error: uploadError } = await supabase.storage
      .from("vendor-documents")
      .upload(filePath, cacFile, { upsert: true });

    if (uploadError) throw uploadError;

    // SAVE VENDOR RECORD
    const { error: vendorError } = await supabase.from("vendors").insert({
      user_id: user.id,
      business_name: data.businessName,
      owner_name: data.ownerFullName,
      email: data.email,
      phone: data.phone,
      cac_url: filePath,
      status: "pending",
    });

    if (vendorError) throw vendorError;

    //  REDIRECT
    navigate("/vendor/login");
  } catch (err: any) {
    console.error("Vendor registration error:", err);
    alert(err.message || "Registration failed");
  } finally {
    setIsSubmitting(false);
  }
};





  const isFormComplete = isValid && cacFile && agreeToTerms;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1B3A5F 0%, #0b1726 100%)',
          padding: '48px 16px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
            TalkToShop
          </span>
        </div>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
          }}
        >
          Vendor Registration
        </h1>
        <p style={{ color: '#a3b9d5', fontSize: '16px' }}>
          Join our marketplace and start selling today
        </p>
      </div>

      {/* Form Container */}
      <div
        style={{
          maxWidth: '560px',
          margin: '-32px auto 0',
          padding: '0 16px 48px',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
            padding: '32px',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Business Name */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1B3A5F',
                  marginBottom: '8px',
                }}
              >
                Business Name <span style={{ color: '#D91C81' }}>*</span>
              </label>
              <input
                type="text"
                {...register('businessName')}
                placeholder="Enter your business name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: errors.businessName ? '2px solid #ef4444' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D91C81')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.businessName ? '#ef4444' : '#e2e8f0')
                }
              />
              {errors.businessName && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
                  {errors.businessName.message}
                </p>
              )}
            </div>

            {/* Owner Full Name */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1B3A5F',
                  marginBottom: '8px',
                }}
              >
                Owner Full Name <span style={{ color: '#D91C81' }}>*</span>
              </label>
              <input
                type="text"
                {...register('ownerFullName')}
                placeholder="Enter owner's full name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: errors.ownerFullName ? '2px solid #ef4444' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D91C81')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.ownerFullName ? '#ef4444' : '#e2e8f0')
                }
              />
              {errors.ownerFullName && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
                  {errors.ownerFullName.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1B3A5F',
                  marginBottom: '8px',
                }}
              >
                Email Address <span style={{ color: '#D91C81' }}>*</span>
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="Enter a new email address "
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: errors.email ? '2px solid #ef4444' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D91C81')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.email ? '#ef4444' : '#e2e8f0')
                }
              />
              {errors.email && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1B3A5F',
                  marginBottom: '8px',
                }}
              >
                Phone Number <span style={{ color: '#D91C81' }}>*</span>
              </label>
              <input
                type="tel"
                {...register('phone')}
                placeholder="Enter your phone number"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: errors.phone ? '2px solid #ef4444' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D91C81')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.phone ? '#ef4444' : '#e2e8f0')
                }
              />
              {errors.phone && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1B3A5F',
                  marginBottom: '8px',
                }}
              >
                Password <span style={{ color: '#D91C81' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Create a password (min. 8 characters)"
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 16px',
                    border: errors.password ? '2px solid #ef4444' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#D91C81')}
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.password ? '#ef4444' : '#e2e8f0')
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CAC Certificate Upload */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1B3A5F',
                  marginBottom: '8px',
                }}
              >
                CAC Certificate <span style={{ color: '#D91C81' }}>*</span>
              </label>
              <div
                style={{
                  border: fileError ? '2px dashed #ef4444' : cacFile ? '2px dashed #10b981' : '2px dashed #e2e8f0',
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: cacFile ? '#f0fdf4' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="file"
                  id="cacFile"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="cacFile" style={{ cursor: 'pointer' }}>
                  {cacFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <CheckCircle size={24} color="#10b981" />
                      <span style={{ color: '#10b981', fontWeight: '500' }}>{cacFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} color="#64748b" style={{ marginBottom: '8px' }} />
                      <p style={{ color: '#64748b', marginBottom: '4px' }}>
                        Click to upload your CAC certificate
                      </p>
                      <p style={{ color: '#94a3b8', fontSize: '13px' }}>
                        PDF, JPG, or PNG (Max 5MB)
                      </p>
                    </>
                  )}
                </label>
              </div>
              {fileError && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>
                  {fileError}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  {...register('agreeToTerms')}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginTop: '2px',
                    accentColor: '#D91C81',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
                  I agree to TalkToShop's{' '}
                  <Link
                    to="/vendor/terms"
                    style={{ color: '#D91C81', textDecoration: 'underline', fontWeight: '500' }}
                  >
                    Terms & Conditions
                  </Link>{' '}
                  and Vendor Rules
                </span>
              </label>
              {errors.agreeToTerms && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px', marginLeft: '32px' }}>
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormComplete || isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: isFormComplete && !isSubmitting ? '#D91C81' : '#e2e8f0',
                color: isFormComplete && !isSubmitting ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isFormComplete && !isSubmitting ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Submitting...
                </>
              ) : (
                'Register as Vendor'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p
            style={{
              textAlign: 'center',
              marginTop: '24px',
              color: '#64748b',
              fontSize: '14px',
            }}
          >
            Already have an account?{' '}
            <Link
              to="/vendor/login"
              style={{ color: '#D91C81', textDecoration: 'none', fontWeight: '600' }}
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer Note */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '24px',
            color: '#64748b',
            fontSize: '13px',
          }}
        >
         NB: Your information is secure and will only be used for verification purposes.
        </p>
      </div>


      {/* Payment Instructions Section */}
<div
  style={{
    marginTop: '32px',
    backgroundColor: '#fef3f3',
    border: '1px solid #fca5a5',
    padding: '24px',
    borderRadius: '12px',
    textAlign: 'center',
  }}
>
  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#b91c1c', marginBottom: '12px' }}>
    Kindly Pay Your Vendor Registration Fee: 5000 Naira
  </h2>

  {/* Account Number */}
  <p style={{ fontSize: '16px', marginBottom: '12px' }}>
    Account Number:{" "}
    <span
      style={{
        fontWeight: 'bold',
        userSelect: 'all',
        cursor: 'pointer',
        backgroundColor: '#fde2e2',
        padding: '2px 6px',
        borderRadius: '4px',
      }}
      onClick={(e) => {
        const text = (e.target as HTMLSpanElement).innerText.replace('Account Number: ', '');
        navigator.clipboard.writeText(text);
        alert('Account number copied!');
      }}
    >
      6102308982
    </span>
    <h2>Account Name: Abdullah Ademola Adeleke</h2>
  <h2>Bank: Opay</h2>

  </p>
  
  {/* Send Message to Admin */}
  <p style={{ marginBottom: '12px', fontSize: '14px', color: '#b91c1c' }}>
    After payment, kindly send a message to the admin for confirmation.
  
     contact admin directly on WhatsApp:{" "}
    <a
       href="https://wa.me/2349025236766"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#16a34a', fontWeight: '600', textDecoration: 'underline' }}
    >
      +2349025236766

    </a>
  </p>
</div>


      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VendorRegister;
