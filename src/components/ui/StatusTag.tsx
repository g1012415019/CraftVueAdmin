import type { PropType } from 'vue'
import type { UserStatus } from '@/types'
import { NTag } from 'naive-ui'

interface Props {
  readonly status: UserStatus
}

const statusConfig = {
  active: { type: 'success' as const, text: 'status.active' },
  inactive: { type: 'error' as const, text: 'status.inactive' },
  pending: { type: 'warning' as const, text: 'status.pending' }
}

export default defineComponent<Props>({
  name: 'StatusTag',
  props: {
    status: {
      type: String as PropType<UserStatus>,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n()
    
    return () => {
      const config = statusConfig[props.status]
      return (
        <NTag type={config.type} size="small">
          {t(config.text)}
        </NTag>
      )
    }
  }
})
