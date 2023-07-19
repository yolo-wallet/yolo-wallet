import dynamic from 'next/dynamic'

export const Modal = dynamic(() => import('antd').then((lib) => lib.Modal), {
  ssr: false,
  loading: () => <div>loading...</div>
})

export default function UpdateModal({
  title,
  open,
  onCancel,
  onOk,
  
}) {third}