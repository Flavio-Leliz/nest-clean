import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserPayload } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
  (_: never, contex: ExecutionContext) => {
    const request = contex.switchToHttp().getRequest()

    return request.user as UserPayload
  },
)
