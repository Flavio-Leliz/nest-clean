import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CommentsProps {
  authorId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

export abstract class Comments<
  Props extends CommentsProps,
> extends Entity<Props> {
  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updateAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
