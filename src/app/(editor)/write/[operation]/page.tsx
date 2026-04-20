"use client"
import TextEditor from '@/components/TextEditor'
import { useEditor } from '@tiptap/react'
import TiptapLink from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { redirect, useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import axios from 'axios'
import { toast } from 'react-toastify'
import SubmitButton from '@/components/layoutComponents/Button/SubmitButton'
import { useDebouncedCallback } from 'use-debounce'
import { ErrorResponse, errorToastHandler } from '@/components/errorTostHandler'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ImageUploadModal from '@/components/UploadImage/UploadImage'
import { useSession } from 'next-auth/react'
import Loading from '@/app/loading'
import { ArrowLeft, Clock, Globe, Image as ImageIcon, Tag, FileText } from 'lucide-react'

interface Option { value: string; label: string }
export interface PreImageProps { src: string; alt: string }

/* ─── tiny helpers ─── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-semibold uppercase tracking-[.08em] text-stone-400 mb-[6px]">
    {children}
  </p>
)

const Card = ({
  icon,
  title,
  children,
  noPad = false,
  overflowVisible = false,
}: {
  icon: React.ReactNode
  title: React.ReactNode
  children: React.ReactNode
  noPad?: boolean
  overflowVisible?: boolean
}) => (
  <div className={`bg-white border border-stone-200/80 rounded-[14px] ${overflowVisible ? 'overflow-visible' : 'overflow-hidden'}`}>
    <div className="flex items-center gap-2.5 px-[18px] py-3.5 border-b border-stone-100 rounded-t-[14px]">
      <span className="text-stone-300 flex-shrink-0">{icon}</span>
      <span className="text-[11px] font-semibold uppercase tracking-[.08em] text-stone-400">
        {title}
      </span>
    </div>
    <div className={noPad ? '' : 'p-[18px]'}>{children}</div>
  </div>
)

const inputCls =
  'w-full border border-stone-200 rounded-[9px] px-3.5 py-2.5 text-[13px] font-[family-name:var(--font-dm)] text-stone-800 bg-stone-50 placeholder:text-stone-300 outline-none transition-all duration-150 focus:border-stone-800 focus:bg-white focus:ring-0'

/* ─── character progress bar ─── */
const CharBar = ({
  value,
  max,
  label,
}: {
  value: number
  max: number
  label: string
}) => {
  const pct = Math.min((value / max) * 100, 100)
  const over = value > max
  return (
    <div className="mt-2">
      <div className="h-[2px] rounded-full bg-stone-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-200 ${over ? 'bg-red-400' : 'bg-stone-800'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={`text-[11px] mt-1 text-right ${over ? 'text-red-400' : 'text-stone-300'}`}>
        {value} / {max} {label}
      </p>
    </div>
  )
}

/* ─── main page ─── */
const Page = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const heroImageRef = useRef<HTMLInputElement>(null)
  const altRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDes, setMetaDes] = useState('')
  const [preImage, setPreImage] = useState<PreImageProps>({ src: '', alt: '' })
  const [selectedTags, setSelectedTags] = useState<Option[]>([])
  const [tags, setTags] = useState([])
  const [content, setContent] = useState('')
  const [fullLoading, setFullLoading] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const session = useSession()
  const param = useParams()
  const searchParams = useSearchParams()
  const animatedComponents = makeAnimated()

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      TiptapLink.configure({ openOnClick: false, autolink: true }),
      Youtube.configure({ controls: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    // ← FIX: avoid showing the literal string "null"
    content:
      typeof window !== 'undefined'
        ? localStorage.getItem('content') || ''
        : '',
  })

  const debounced = useDebouncedCallback((val: { key: string; value: string }) => {
    window.localStorage.setItem(val.key, val.value)
    setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }, 10000)

  /* ─── load data ─── */
  useEffect(() => {
    if (session.data?.user.role === 'USER') redirect('/')

    const getData = async () => {
      const { data } = await axios.get('/api/tags/get')
      let tag = data.data.map((val: any) => val.value)
      tag = tag.flat(1).map((val: string) => ({ value: val, label: val }))
      setTags(tag)
    }
    getData()

    if (param.operation === 'new') {
      setTitle(localStorage.getItem('title') ?? '')
      setExcerpt(localStorage.getItem('excerpt') ?? '')
      setPreImage({
        src: localStorage.getItem('heroImage') ?? '',
        alt: localStorage.getItem('alt') ?? '',
      })
      setMetaTitle(localStorage.getItem('metaTitle') ?? '')
      setMetaDes(localStorage.getItem('metaDes') ?? '')
    }

    if (param.operation === 'edit') {
      setFullLoading(true)
      const slug = searchParams.get('slug')
      if (!slug) { router.back(); return }

      const getPostData = async () => {
        const res = await axios.get(`/api/blog/${slug}`)
        if (res.data.success) {
          setTitle(res.data.data.title)
          setExcerpt(res.data.data.excerpt ?? '')
          setMetaTitle(res.data.data.metaTitle)
          setMetaDes(res.data.data.metaDesc)
          setPreImage({ src: res.data.data.image.src, alt: res.data.data.image.alt })
          const c = JSON.parse(res.data.data.content)
          setContent(c)
        }
        setFullLoading(false)
      }
      getPostData()
    }
  }, [param.operation, searchParams, router, session.data?.user.role])

  /* ─── autosave every 5 s ─── */
  useEffect(() => {
    const save = () => {
      if (editor) {
        localStorage.setItem('content', editor.getHTML())
        setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      }
    }
    const id = setInterval(save, 5000)
    return () => clearInterval(id)
  }, [editor])

  useEffect(() => {
    if (editor && !!content && param.operation === 'edit') {
      editor.commands.setContent(content)
    }
  }, [editor, content, param.operation])

  if (!editor) return null

  /* ─── helpers ─── */
  const clearStorage = () =>
    ['title', 'excerpt', 'heroImage', 'alt', 'content', 'metaTitle', 'metaDes'].forEach(
      (k) => localStorage.setItem(k, '')
    )

  const clearData = (msg: string, path: string) => {
    toast.success(msg)
    clearStorage()
    router.push(`/post/${path}`)
  }

  const validate = () => {
    if (
      !title ||
      !preImage.src ||
      !preImage.alt ||
      !excerpt ||
      !metaDes ||
      !metaTitle ||
      selectedTags.length < 1
    ) {
      toast.error('Please fill all required fields')
      return false
    }
    return true
  }

  const publicBlog = async () => {
    try {
      setLoading(true)
      if (!validate()) { setLoading(false); return }
      const t = selectedTags.map((tag) => tag.value)
      const res = await axios.post('/api/blog/writer/create', {
        title,
        image: preImage,
        excerpt,
        content: JSON.stringify(editor.getHTML()),
        metaTitle,
        metaDesc: metaDes,
        tags: t,
      })
      if (res.data.success) clearData('Published successfully!', res.data.data.slug)
      setLoading(false)
    } catch (error: ErrorResponse | any) {
      setLoading(false)
      errorToastHandler(error)
    }
  }

  const updatePost = async () => {
    try {
      const slug = searchParams.get('slug')
      if (!slug) { toast.error('Blog not found'); router.back(); return }
      setLoading(true)
      if (!validate()) { setLoading(false); return }
      const t = selectedTags.map((tag) => tag.value)
      const res = await axios.put('/api/blog/writer/update', {
        slug,
        title,
        image: preImage,
        excerpt,
        content: JSON.stringify(editor.getHTML()),
        metaTitle,
        metaDesc: metaDes,
        tags: t,
      })
      if (res.data.success) clearData('Updated successfully!', res.data.data.slug)
      setLoading(false)
    } catch (error: ErrorResponse | any) {
      setLoading(false)
      errorToastHandler(error)
    }
  }

  const isNew = param.operation === 'new'

  return (
    <>
      {fullLoading && <Loading background="bg-white/80" />}

      <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Top bar ── */}
        <header className="sticky top-0 z-50 h-14 bg-white border-b border-stone-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[13px] text-stone-400 hover:text-stone-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <div className="w-px h-4 bg-stone-200" />
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] font-medium text-stone-800">
                {isNew ? 'Create new post' : 'Edit post'}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[.05em] bg-stone-100 text-stone-400 px-2 py-0.5 rounded-full">
                Draft
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {savedAt && (
              <span className="hidden sm:flex items-center gap-1.5 text-[12px] text-stone-300">
                <Clock className="w-3 h-3" />
                Saved {savedAt}
              </span>
            )}
            <SubmitButton
              loading={loading}
              onClick={isNew ? publicBlog : updatePost}
              mainClass="flex items-center gap-2 px-5 py-2 bg-stone-900 text-white text-[13px] font-medium rounded-lg hover:bg-stone-700 transition-colors"
            >
              {isNew ? 'Publish' : 'Update'}
            </SubmitButton>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-5 items-start">

            {/* ── Left column ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">

              {/* Post details */}
              <Card icon={<FileText className="w-3.5 h-3.5" />} title="Post details">
                <div className="flex flex-col gap-4">
                  <div>
                    <SectionLabel>Title *</SectionLabel>
                    <input
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value)
                        debounced({ key: 'title', value: e.target.value })
                      }}
                      placeholder="Give your post a memorable title…"
                      className={`${inputCls} text-[16px] font-[family-name:var(--font-lora)]`}
                      style={{ fontFamily: "'Lora', serif", fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <SectionLabel>Excerpt</SectionLabel>
                    <textarea
                      value={excerpt}
                      onChange={(e) => {
                        setExcerpt(e.target.value)
                        debounced({ key: 'excerpt', value: e.target.value })
                      }}
                      placeholder="A short preview shown in blog cards and search results…"
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                    <CharBar value={excerpt.length} max={300} label="chars" />
                  </div>
                </div>
              </Card>

              {/* Content editor */}
              <div>
                <SectionLabel>Content *</SectionLabel>
                <div className="bg-white border border-stone-200/80 rounded-[14px] overflow-hidden">
                  <div className="editor-wrapper">
                    <TextEditor editor={editor} />
                  </div>
                  <div className="flex items-center justify-between px-4 py-2 border-t border-stone-100 bg-stone-50/60">
                    <span className="text-[11px] text-stone-300">
                      {editor.getText().length} characters
                    </span>
                    <span className="text-[11px] text-stone-300">
                      {editor.getText().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* ── Right sidebar ── */}
            <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-4 lg:sticky lg:top-[72px]">

              {/* Featured image */}
              <Card icon={<ImageIcon className="w-3.5 h-3.5" />} title="Featured image">
                <div className="flex flex-col gap-3">

                  {/* Preview area */}
                  {preImage.src ? (
                    <div className="relative group rounded-[10px] overflow-hidden bg-stone-100 aspect-[16/9]">
                      <img
                        src={preImage.src}
                        alt={preImage.alt || 'Featured image preview'}
                        className="w-full h-full object-cover"
                      />
                      {/* Hover overlay with replace button */}
                      <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageUploadModal
                          preImage={preImage}
                          setPreImage={setPreImage}
                          debounced={debounced}
                          heroImageRef={heroImageRef}
                          altRef={altRef}
                          button={
                            <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-stone-800 text-[12px] font-medium rounded-lg hover:bg-stone-50 transition-colors">
                              <ImageIcon className="w-3 h-3" />
                              Replace image
                            </button>
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    /* Empty drop zone */
                    <ImageUploadModal
                      preImage={preImage}
                      setPreImage={setPreImage}
                      debounced={debounced}
                      heroImageRef={heroImageRef}
                      altRef={altRef}
                      button={
                        <button className="w-full flex flex-col items-center justify-center gap-2.5 border border-dashed border-stone-200 hover:border-stone-400 bg-stone-50 hover:bg-stone-100/60 rounded-[10px] py-8 transition-all group cursor-pointer">
                          <div className="w-9 h-9 rounded-[9px] bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center transition-colors">
                            <ImageIcon className="w-4 h-4 text-stone-400" />
                          </div>
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-[13px] font-medium text-stone-500">Upload cover image</span>
                            <span className="text-[11px] text-stone-300">JPG, PNG, SVG · up to 10 MB</span>
                          </div>
                        </button>
                      }
                    />
                  )}

                  {/* Alt text */}
                  <div>
                    <SectionLabel>Alt text</SectionLabel>
                    <input
                      ref={altRef}
                      value={preImage.alt}
                      onChange={(e) => {
                        setPreImage((p) => ({ ...p, alt: e.target.value }))
                        debounced({ key: 'alt', value: e.target.value })
                      }}
                      placeholder="Describe the image for accessibility…"
                      className={inputCls}
                    />
                  </div>

                </div>
              </Card>

              {/* Tags */}
              <Card icon={<Tag className="w-3.5 h-3.5" />} title="Tags" overflowVisible>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  value={selectedTags}
                  onChange={(opts) =>
                    setSelectedTags(opts ? Array.from(opts) : [])
                  }
                  options={tags}
                  placeholder="Add tags…"
                  menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: (b) => ({ ...b, zIndex: 9999 }),
                    control: (b) => ({
                      ...b,
                      borderRadius: '9px',
                      borderColor: '#E7E5E4',
                      borderWidth: '1px',
                      boxShadow: 'none',
                      fontSize: '13px',
                      backgroundColor: '#FAFAF8',
                      minHeight: '38px',
                      '&:hover': { borderColor: '#A8A29E' },
                    }),
                    multiValue: (b) => ({
                      ...b,
                      borderRadius: '20px',
                      backgroundColor: '#F5F3EF',
                    }),
                    multiValueLabel: (b) => ({
                      ...b,
                      color: '#57534E',
                      fontSize: '11px',
                      fontWeight: 600,
                      paddingLeft: '8px',
                    }),
                    multiValueRemove: (b) => ({
                      ...b,
                      borderRadius: '0 20px 20px 0',
                      color: '#A8A29E',
                      '&:hover': { backgroundColor: '#E7E5E4', color: '#1C1917' },
                    }),
                    placeholder: (b) => ({
                      ...b,
                      color: '#D6D3D1',
                      fontSize: '13px',
                    }),
                    menu: (b) => ({
                      ...b,
                      borderRadius: '12px',
                      border: '1px solid #E7E5E4',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                    }),
                    option: (b, s) => ({
                      ...b,
                      fontSize: '13px',
                      backgroundColor: s.isSelected
                        ? '#1C1917'
                        : s.isFocused
                        ? '#F5F3EF'
                        : 'white',
                      color: s.isSelected ? 'white' : '#1C1917',
                    }),
                    indicatorSeparator: () => ({ display: 'none' }),
                  }}
                />
              </Card>

              {/* SEO */}
              <Card icon={<Globe className="w-3.5 h-3.5" />} title="SEO settings">
                <div className="flex flex-col gap-4">
                  <div>
                    <SectionLabel>SEO title</SectionLabel>
                    <input
                      value={metaTitle}
                      onChange={(e) => {
                        setMetaTitle(e.target.value)
                        debounced({ key: 'metaTitle', value: e.target.value })
                      }}
                      placeholder="Title for search engines"
                      className={inputCls}
                    />
                    <CharBar value={metaTitle.length} max={60} label="chars" />
                  </div>
                  <div>
                    <SectionLabel>Meta description</SectionLabel>
                    <textarea
                      value={metaDes}
                      onChange={(e) => {
                        setMetaDes(e.target.value)
                        debounced({ key: 'metaDes', value: e.target.value })
                      }}
                      placeholder="Describe the page for search results…"
                      rows={4}
                      className={`${inputCls} resize-none`}
                    />
                    <CharBar value={metaDes.length} max={160} label="chars" />
                  </div>
                </div>
              </Card>

            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        /* ─ editor chrome ─ */
        .editor-wrapper .ProseMirror,
        .editor-wrapper .tiptap {
          border: none !important;
          border-radius: 0 !important;
          padding: 20px 22px !important;
          min-height: 380px;
          font-family: 'Lora', serif !important;
          font-size: 15.5px;
          color: #44403C;
          line-height: 1.875;
          outline: none;
        }
        .editor-wrapper .tiptap p {
          margin-bottom: 1rem;
        }
        .editor-wrapper .tiptap h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1C1917;
          margin: 2rem 0 0.75rem;
          font-family: 'Lora', serif;
        }
        .editor-wrapper .tiptap h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1C1917;
          margin: 1.75rem 0 0.6rem;
          font-family: 'Lora', serif;
        }
        .editor-wrapper .tiptap h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1C1917;
          margin: 1.4rem 0 0.5rem;
          font-family: 'Lora', serif;
        }
        .editor-wrapper .tiptap blockquote {
          border-left: 2px solid #D6D3D1;
          background: #FAFAF8;
          padding: 0.875rem 1.375rem;
          border-radius: 0 10px 10px 0;
          color: #78716C;
          font-style: italic;
          margin: 1.5rem 0;
        }
        .editor-wrapper .tiptap blockquote::before {
          display: none;
        }
        .editor-wrapper .tiptap img {
          border-radius: 12px;
          margin: 1.5rem auto;
          display: block;
          max-width: 100%;
        }
        .editor-wrapper .tiptap pre {
          background: #1C1917;
          color: #E7E5E4;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          font-size: 13px;
          line-height: 1.7;
          overflow-x: auto;
        }
        .editor-wrapper .tiptap code:not(pre code) {
          background: #F5F3EF;
          color: #C2410C;
          border-radius: 5px;
          padding: 1px 6px;
          font-size: 13px;
        }
        .editor-wrapper .tiptap ul {
          padding-left: 1.5rem;
          list-style: disc;
          margin-bottom: 1rem;
        }
        .editor-wrapper .tiptap ol {
          padding-left: 1.5rem;
          list-style: decimal;
          margin-bottom: 1rem;
        }
        .editor-wrapper .tiptap a {
          color: #57534E;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .editor-wrapper .tiptap table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.25rem 0;
        }
        .editor-wrapper .tiptap th,
        .editor-wrapper .tiptap td {
          border: 1px solid #E7E5E4;
          padding: 8px 12px;
          font-size: 14px;
        }
        .editor-wrapper .tiptap th {
          background: #FAFAF8;
          font-weight: 600;
          color: #1C1917;
        }
        .editor-wrapper .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #D6D3D1;
          float: left;
          height: 0;
          pointer-events: none;
          font-style: italic;
        }

        /* ─ tiptap toolbar (if rendered by TextEditor) ─ */
        .editor-wrapper .toolbar,
        .editor-wrapper [class*="toolbar"] {
          border-bottom: 1px solid #F5F3EF !important;
          background: #FAFAF8 !important;
          padding: 8px 14px !important;
          gap: 3px !important;
          flex-wrap: wrap;
        }
        .editor-wrapper button[class*="toolbar"],
        .editor-wrapper .toolbar button {
          border-radius: 6px !important;
          border: none !important;
          padding: 5px 7px !important;
          font-size: 12px !important;
          color: #78716C !important;
          background: none !important;
          transition: background .12s, color .12s !important;
        }
        .editor-wrapper .toolbar button:hover,
        .editor-wrapper button[class*="toolbar"]:hover {
          background: #EDE9E4 !important;
          color: #1C1917 !important;
        }
        .editor-wrapper .toolbar button.is-active,
        .editor-wrapper button[class*="toolbar"].is-active {
          background: #1C1917 !important;
          color: white !important;
        }
      `}</style>
    </>
  )
}

export default Page