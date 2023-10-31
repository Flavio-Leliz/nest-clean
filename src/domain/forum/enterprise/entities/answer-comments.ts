import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/opcional'
import { Comments, CommentsProps } from './comments'

export interface AnswerCommentsProps extends CommentsProps {
  answerId: UniqueEntityID
}

export class AnswerComments extends Comments<AnswerCommentsProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(
    props: Optional<AnswerCommentsProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const answerComments = new AnswerComments(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return answerComments
  }
}
