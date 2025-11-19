/**
 * TableLowcode 统一消息提示工具
 * 避免直接依赖全局的 window.$message
 */

import { createDiscreteApi } from 'naive-ui'

// 创建独立的消息API实例
const { message } = createDiscreteApi(['message'])

/**
 * 消息提示工具类
 */
export class MessageUtil {
  /**
   * 成功消息
   */
  static success(content: string) {
    message.success(content)
  }

  /**
   * 错误消息
   */
  static error(content: string) {
    message.error(content)
  }

  /**
   * 警告消息
   */
  static warning(content: string) {
    message.warning(content)
  }

  /**
   * 信息消息
   */
  static info(content: string) {
    message.info(content)
  }

  /**
   * 加载消息
   */
  static loading(content: string) {
    return message.loading(content)
  }
}

// 导出默认实例
export const msg = MessageUtil

// 兼容性导出
export default MessageUtil
