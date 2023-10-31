import { InMemoryNotificationsRepository } from 'tests/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase // system under test

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be able to create a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'teste create notification',
      content: 'conteúdo da notificação criada',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationRepository.item[0]).toEqual(
      result.value?.notification,
    )
  })
})
