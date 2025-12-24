import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { author, email, content, postId, parentCommentId } = body

    // Validate required fields
    if (!author || !email || !content || !postId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create comment in Sanity
    const comment = {
      _type: 'comment',
      author,
      email,
      content,
      post: {
        _type: 'reference',
        _ref: postId,
      },
      approved: false, // Comments require moderation
      createdAt: new Date().toISOString(),
      ...(parentCommentId && {
        parentComment: {
          _type: 'reference',
          _ref: parentCommentId,
        },
      }),
    }

    const result = await client.create(comment)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Comment submitted successfully. It will appear after moderation.',
        id: result._id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to submit comment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      )
    }

    // Fetch approved comments for this post
    const comments = await client.fetch(`
      *[_type == "comment" && post._ref == $postId && approved == true] | order(createdAt asc) {
        _id,
        author,
        content,
        createdAt,
        parentComment
      }
    `, { postId })

    return NextResponse.json({ comments }, { status: 200 })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

