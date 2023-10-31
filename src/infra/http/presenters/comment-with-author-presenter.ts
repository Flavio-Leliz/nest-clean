import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author'

export class CommentWithAuthorPresenter {
  static toHTTP(commentWithAturho: CommentWithAuthor) {
    return {
      commentId: commentWithAturho.commentId,
      authorId: commentWithAturho.authorId,
      author: commentWithAturho.author,
      content: commentWithAturho.content,
      createdAt: commentWithAturho.createdAt,
      updatedAt: commentWithAturho.updatedAt,
    }
  }
}
