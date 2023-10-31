import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/opcional'
import { Comments, CommentsProps } from './comments'

export interface QuestionCommentsProps extends CommentsProps {
  questionId: UniqueEntityID
}

export class QuestionComments extends Comments<QuestionCommentsProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentsProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const questionComments = new QuestionComments(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return questionComments
  }
}
