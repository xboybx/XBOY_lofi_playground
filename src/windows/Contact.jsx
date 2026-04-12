import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { useSiteStore } from '../store/siteStore'
import useWindowStore from '#store/window'
import { Mail } from 'lucide-react/dist/esm/icons'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'

const Contact = () => {
  const { data: siteData } = useSiteStore();
  const isMaximized = useWindowStore(state => state.windows.contact?.isMaximized);
  const email = 'j.jaswanth@icloud.com'
  const [showModal, setShowModal] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [result, setResult] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submissionResults, setSubmissionResults] = useState({ key1: null, key2: null })

  // react-hook-form
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm()

  // Web3Forms setup - send to both emails
  const accessKey1 = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY_1 || '18536a8d-1f17-4f02-97b1-e5cf2b45e4fb'
  const accessKey2 = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY_2 || '3632924f-f67c-4571-883a-ae15e8c4ed16'

  // Function to submit to both endpoints
  const submitToBothEndpoints = async (formData) => {
    setSubmitting(true)
    setResult('Sending message...')

    const submitToEndpoint = async (accessKey, keyName) => {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: accessKey,
            from_name: 'macOS Portfolio – Contact',
            subject: 'New Contact Message from macOS Portfolio',
            ...formData
          })
        })

        const result = await response.json()
        return { success: response.ok, message: result.message, keyName }
      } catch (error) {
        return { success: false, message: error.message, keyName }
      }
    }

    // Submit to both endpoints simultaneously
    const [result1, result2] = await Promise.all([
      submitToEndpoint(accessKey1, 'primary'),
      submitToEndpoint(accessKey2, 'secondary')
    ])

    setSubmissionResults({ key1: result1, key2: result2 })

    // Check results
    const bothSuccessful = result1.success && result2.success
    const oneSuccessful = result1.success || result2.success

    if (bothSuccessful) {
      setIsSuccess(true)
      setResult('Message sent successfully to both email addresses!')
      reset()
    } else if (oneSuccessful) {
      setIsSuccess(true)
      setResult(`Message sent successfully to ${result1.success ? 'primary' : 'secondary'} email address. ${!result1.success ? result1.message : result2.message}`)
      reset()
    } else {
      setIsSuccess(false)
      setResult(`Failed to send message. Primary: ${result1.message}, Secondary: ${result2.message}`)
    }

    setSubmitting(false)
  }

  useEffect(() => {
    if (isSuccess && showModal) {
      const t = setTimeout(() => setShowModal(false), 1800)
      return () => clearTimeout(t)
    }
  }, [isSuccess, showModal])

  return (
    <>
      <div id='window-header' className='flex items-center justify-between window-drag-handle'>
        <WindowControls target="contact" />
        <h2 className='flex-1 text-center'>Contact Me</h2>
        <a
          href={`mailto:${email}`}
          title={`Email: ${email}`}
          className='p-2 hover:bg-gray-200 rounded-md transition-colors'
        >
          <Mail size={17} />
        </a>
      </div>
      <div className='p-5 space-y-5'>
        <img
          src={siteData?.about?.avatarUrl || 'https://ik.imagekit.io/mtkm3escy/protfolio%20pic.JPG?updatedAt=1763837489716'}
          alt='Jaswanth'
          loading='lazy'
          className={clsx(
            'object-cover object-top rounded-xl',
            isMaximized ? 'w-60 h-40' : 'w-30 h-20'
          )}
        />
        <h3>
          Let's Connect
        </h3>
        <p>
          Open for work and collaboration. Write me if you need something built.
        </p>
        <p>
          xboy.wav@gmail.com
        </p>
        <ul className='grid grid-cols-2 gap-3'>
          {[
            {
              id: 'insta',
              bg: '#E4405F',
              link: siteData?.socials?.instagram,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              ),
              text: 'Instagram'
            },
            {
              id: 'yt',
              bg: '#FF0000',
              link: siteData?.socials?.youtube,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 58.38 58.38 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 58.38 58.38 0 0 1-15 0 2 2 0 0 1-2-2Z" /><path d="m10 15 5-3-5-3z" />
                </svg>
              ),
              text: 'YouTube'
            },
            {
              id: 'spot',
              bg: '#1DB954',
              link: siteData?.socials?.spotify,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.307c-.22.36-.677.472-1.037.253-2.877-1.758-6.497-2.157-10.762-1.18-.41.094-.82-.163-.914-.573-.094-.41.163-.82.573-.914 4.667-1.066 8.657-.615 11.88 1.353.36.22.472.677.253 1.037zm1.467-3.258c-.277.45-.86.597-1.31.32-3.294-2.023-8.318-2.613-12.215-1.43-.507.153-1.04-.143-1.193-.65-.153-.507.143-1.04.65-1.193 4.46-1.353 10.007-.7 13.748 1.6 0 .45-.276.596.86.32 1.31zm.126-3.414c-3.948-2.345-10.462-2.56-14.234-1.415-.606.183-1.25-.166-1.433-.772-.183-.606.166-1.25.772-1.433 4.337-1.316 11.53-1.063 16.082 1.638.544.323.722 1.026.4 1.57-.323.544-1.026.722-1.57.4z" />
                </svg>
              ),
              text: 'Spotify'
            },
            {
              id: 'github',
              bg: '#333',
              link: siteData?.socials?.github,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              ),
              text: 'GitHub'
            },
            {
              id: 'linkedin',
              bg: '#0077b5',
              link: siteData?.socials?.linkedin,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
                </svg>
              ),
              text: 'LinkedIn'
            },
          ].filter(s => s.link).map(({ id, bg, link, icon, text }) => (
            <li key={id} className='rounded-lg transition-transform hover:scale-105 active:scale-95' style={{ backgroundColor: bg }}>
              <a
                href={link}
                target='_blank'
                rel='noopener noreferrer'
                title={text}
                className="flex items-center gap-2 px-3 py-1.5 text-white"
              >
                <div className="flex items-center justify-center">
                  {icon}
                </div>
                <p className='text-xs font-medium'>
                  {text}
                </p>
              </a>
            </li>
          ))}
          {/* Contact form trigger as an extra social item */}
          <li key="contact-form" className='rounded-lg bg-black transition-transform hover:scale-105 active:scale-95'>
            <a
              href="#contact-form"
              title="Contact Form"
              className='flex items-center gap-2 px-3 py-1.5 text-white'
              onClick={(e) => {
                e.preventDefault()
                setIsSuccess(false)
                setResult('')
                setShowModal(true)
              }}
            >
              <Mail className='size-[18px]' />
              <p className='text-xs font-medium'>Contact Form</p>
            </a>
          </li>
        </ul>
      </div>

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-[2px]'
            onClick={() => setShowModal(false)}
          />
          <div className='relative z-10 w-[min(92vw,520px)] rounded-xl border border-gray-200 bg-white shadow-2xl'>
            <div className='flex items-center justify-between border-b px-5 py-3'>
              <div className='flex items-center gap-2'>
                <Mail size={18} />
                <h3 className='text-base font-semibold'>Send me a message</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className='rounded-md p-1.5 text-gray-500 hover:bg-gray-100'
                aria-label='Close'
              >
                ✕
              </button>
            </div>

            <form
              className='p-5 space-y-4'
              onSubmit={handleSubmit((data) => {
                submitToBothEndpoints(data)
              })}
            >
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-1 sm:col-span-1'>
                  <label htmlFor="contact-name" className='text-sm text-gray-700'>Name</label>
                  <input
                    id="contact-name"
                    type='text'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400'
                    placeholder='Your name'
                    autoComplete="name"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <p className='text-xs text-red-600'>{errors.name.message}</p>
                  )}
                </div>
                <div className='space-y-1 sm:col-span-1'>
                  <label htmlFor="contact-email" className='text-sm text-gray-700'>Email</label>
                  <input
                    id="contact-email"
                    type='email'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400'
                    placeholder='you@example.com'
                    autoComplete="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /[^@\s]+@[^@\s]+\.[^@\s]+/,
                        message: 'Enter a valid email'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className='text-xs text-red-600'>{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className='space-y-1'>
                <label htmlFor="contact-message" className='text-sm text-gray-700'>Message</label>
                <textarea
                  id="contact-message"
                  rows={5}
                  className='w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400'
                  placeholder="What's on your mind?"
                  autoComplete="off"
                  {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Please write at least 10 characters' } })}
                />
                {errors.message && (
                  <p className='text-xs text-red-600'>{errors.message.message}</p>
                )}
              </div>

              {/* Hidden text honeypot field */}
              <input
                type="text"
                id="botcheck"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                {...register('botcheck')}
              />

              {result && (
                <div className={`rounded-md border px-3 py-2 text-sm ${isSuccess ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'}`}>
                  {result}
                </div>
              )}

              <div className='flex items-center justify-between pt-1'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={submitting}
                  className='inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {submitting && (
                    <span className='inline-block size-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent' />
                  )}
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

const ContactWindow = WindowWrapper(Contact, 'contact')

export default ContactWindow;
