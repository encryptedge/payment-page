import { RedirectType, redirect } from 'next/navigation'

function NotFound() {
    redirect('https://rcs.encryptedge.in', RedirectType.replace)
}

export default NotFound
