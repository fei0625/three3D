import { ElMessage } from 'element-plus'
import type { MessageOptions } from 'element-plus'
let messageInstance: any | null = null

export class useMessage {
  private Message({ type = 'info', ...obj }: MessageOptions) {
    if (messageInstance && messageInstance.close) {
      messageInstance.close()
    }
    messageInstance = ElMessage({
      type,
      ...obj
    })
  }

  public success(props: Omit<MessageOptions, 'type'>) {
    this.Message({ type: 'success', ...props })
  }
  public warning(props: Omit<MessageOptions, 'type'>) {
    this.Message({ type: 'warning', ...props })
  }
  public info(props: Omit<MessageOptions, 'type'>) {
    this.Message({ type: 'info', ...props })
  }
  public error(props: Omit<MessageOptions, 'type'>) {
    this.Message({ type: 'error', ...props })
  }
}
