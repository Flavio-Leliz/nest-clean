export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(pros: Props) {
    this.props = pros
  }

  public equals(vo: ValueObject<unknown>) {
    if (vo === null || vo === undefined) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }

    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}
