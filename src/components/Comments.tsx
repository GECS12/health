'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Send, Loader2 } from 'lucide-react'

interface Comment {
  _id: string
  author: string
  content: string
  createdAt: string
  parentComment?: {
    _ref: string
  }
}

interface CommentsProps {
  postId: string
}

export function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: '',
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${postId}`)
        const data = await response.json()
        if (data.comments) {
          setComments(data.comments)
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [postId])

  // Organize comments into threads
  const organizeComments = (comments: Comment[]) => {
    const topLevel: Comment[] = []
    const replies: Record<string, Comment[]> = {}

    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parentId = comment.parentComment._ref
        if (!replies[parentId]) {
          replies[parentId] = []
        }
        replies[parentId].push(comment)
      } else {
        topLevel.push(comment)
      }
    })

    return { topLevel, replies }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          postId,
          ...(replyTo && { parentCommentId: replyTo }),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setFormData({ author: '', email: '', content: '' })
        setShowForm(false)
        setReplyTo(null)
        // Refresh comments after a short delay
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit comment' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const { topLevel, replies } = organizeComments(comments)

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const commentReplies = replies[comment._id] || []
    const isReply = depth > 0

    return (
      <div className={`comment-item ${isReply ? 'comment-reply' : ''}`} style={{ marginLeft: depth > 0 ? '2rem' : '0' }}>
        <div className="comment-header">
          <span className="comment-author">{comment.author}</span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>
        <div className="comment-content">{comment.content}</div>
        {depth < 2 && (
          <button
            className="comment-reply-btn"
            onClick={() => {
              setReplyTo(comment._id)
              setShowForm(true)
            }}
          >
            Responder
          </button>
        )}
        {commentReplies.length > 0 && (
          <div className="comment-replies">
            {commentReplies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }



  return (
    <section className="comments-section">
      <button 
        className="comments-header-toggle" 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0',
          marginBottom: isExpanded ? '32px' : '0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare size={20} className="text-accent" />
          <h2 className="comments-title">
            Comentários {comments.length > 0 && `(${comments.length})`}
          </h2>
        </div>
        <div style={{ 
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }}>
          {/* ChevronDown/Up simulation or import icon (I didn't import ChevronDown, using text or existing imports) 
             I have Loader2, MessageSquare, Send. I'll stick to a simple caret or add ChevronDown to imports. 
          */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </button>

      {isExpanded && (
        <div className="comments-body animate-in slide-in-from-top-4 fade-in duration-300">
          {loading ? (
            <div className="comments-loading">
              <Loader2 className="animate-spin" size={20} />
              <span>A carregar comentários...</span>
            </div>
          ) : (
            <>
              {topLevel.length === 0 ? (
                <p className="comments-empty">Ainda não há comentários. Seja o primeiro a comentar!</p>
              ) : (
                <div className="comments-list">
                  {topLevel.map((comment) => (
                    <CommentItem key={comment._id} comment={comment} />
                  ))}
                </div>
              )}
    
              {message && (
                <div className={`comment-message comment-message-${message.type}`}>
                  {message.text}
                </div>
              )}
    
              {(showForm || topLevel.length === 0) && (
                <form className="comment-form" onSubmit={handleSubmit}>
                  {replyTo && (
                    <div className="comment-reply-indicator">
                      A responder a um comentário
                      <button
                        type="button"
                        className="comment-cancel-reply"
                        onClick={() => {
                          setReplyTo(null)
                          setShowForm(false)
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                  <div className="comment-form-row">
                    <input
                      type="text"
                      placeholder="Nome"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      required
                      className="comment-input"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="comment-input"
                    />
                  </div>
                  <textarea
                    placeholder="Escreva o seu comentário..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={4}
                    className="comment-textarea"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="comment-submit-btn"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        A enviar...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Enviar Comentário
                      </>
                    )}
                  </button>
                </form>
              )}
    
              {!showForm && topLevel.length > 0 && (
                <button
                  className="comment-show-form-btn"
                  onClick={() => setShowForm(true)}
                >
                  <MessageSquare size={16} />
                  Adicionar Comentário
                </button>
              )}
            </>
          )}
        </div>
      )}
    </section>
  )
}


