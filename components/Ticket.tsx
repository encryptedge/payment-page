'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import {
    RegisterForm,
    registerFormSchema,
} from '@/validators/register.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import axios from 'axios'
import useRazorpay from 'react-razorpay'
import Button from './ui/Button'
import { useRouter } from 'next/navigation'

type StatusType = 'pending' | 'success' | 'error'

export default function Ticket({ ticketType }: { ticketType: string }) {
    const open = true
    const setOpen = (val: boolean) => {}
    const [Razorpay] = useRazorpay()
    const [status, setStatus] = useState<StatusType>('pending')
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerFormSchema),
    })
    const formSubmit = async (data: RegisterForm) => {
        if (data.uni_id === '') data.uni_id = 'N/A'
        if (data.uni_name === '') data.uni_name = 'N/A'

        try {
            const res = await axios.post(
                process.env.NEXT_PUBLIC_API_URL + '/order',
                {
                    ticket_type: ticketType,
                    ticket_data: data,
                }
            )
            const orderData = res.data
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'RCS CTF 2024',
                description: 'RCS CTF 2024 Ticket',
                image: 'https://rcs.encryptedge.in/favicon.ico',
                order_id: orderData.id,
                handler: async function (response: any) {
                    toast.success('Payment Recieved! Pease wait', {
                        position: 'top-right',
                    })

                    const verifyData = await axios.get(
                        process.env.NEXT_PUBLIC_API_URL +
                            '/check-pay/' +
                            orderData.id
                    )
                    if (
                        verifyData.data?.message === 'Email sent successfully'
                    ) {
                        setStatus('success')
                        toast.success('Ticket Confirmed!', {
                            position: 'top-right',
                        })
                    } else {
                        setStatus('error')
                        toast.error('Ticket not verified!', {
                            position: 'top-right',
                        })
                    }
                },
                prefill: {
                    name: data.name,
                    email: data.email,
                    contact: data.contact_no,
                },
                theme: {
                    color: '#531062',
                },
            }

            const rzp1 = new Razorpay(options)

            toast.success(
                'Payment initiated, wait for 30-60 seconds after payment! DO NOT RELOAD OR LEAVE THE PAGE',
                {
                    position: 'top-right',
                    duration: 60000,
                }
            )

            rzp1.on('payment.failed', function (response: any) {
                setStatus('error')
                toast.error(
                    'Payment Failed! reach out us with order id ' +
                        response.error.metadata.order_id,
                    {
                        duration: 60000,
                    }
                )
            })

            rzp1.open()
        } catch (err) {
            console.log(err)
            toast.error('Error Submitting Form')
        } finally {
            setOpen(false)
            reset()
        }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative w-full  transform overflow-hidden rounded-lg bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                {status === 'pending' && (
                                    <form
                                        onSubmit={handleSubmit(formSubmit)}
                                        className="space-y-6 "
                                        action="#"
                                        method="POST"
                                    >
                                        <div>
                                            <h2 className="text-4xl font-extrabold dark:text-white">RCS CTF Ticket</h2>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium leading-6 text-white"
                                            >
                                                Full Name *
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="name"
                                                    autoComplete="name"
                                                    {...register('name')}
                                                    className="block px-5 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                            {errors.name && (
                                                <div className="text-sm text-red-500">
                                                    {errors.name.message}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium leading-6 text-white"
                                            >
                                                Email Address *
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="email"
                                                    autoComplete="email"
                                                    type="email"
                                                    {...register('email')}
                                                    className="block px-5 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                            {errors.email && (
                                                <div className="text-sm text-red-500">
                                                    {errors.email.message}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="contact_no"
                                                className="block text-sm font-medium leading-6 text-white"
                                            >
                                                Contact Number *
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="contact_no"
                                                    autoComplete="contact_no"
                                                    {...register('contact_no')}
                                                    className="block px-5 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                            {errors.contact_no && (
                                                <div className="text-sm text-red-500">
                                                    {errors.contact_no.message}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="uni_id"
                                                className="block text-sm font-medium leading-6 text-white"
                                            >
                                                College/University Id
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="uni_id"
                                                    {...register('uni_id')}
                                                    className="block px-5 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                            {errors.uni_id && (
                                                <div className="text-sm text-red-500">
                                                    {errors.uni_id.message}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="uni_name"
                                                className="block text-sm font-medium leading-6 text-white"
                                            >
                                                College/University Name
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="uni_name"
                                                    {...register('uni_name')}
                                                    className="block px-5 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                            {errors.uni_name && (
                                                <div className="text-sm text-red-500">
                                                    {errors.uni_name.message}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="where_you_reside"
                                                className="block text-sm font-medium leading-6 text-white"
                                            >
                                                Where do You Reside? *
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="where_you_reside"
                                                    {...register(
                                                        'where_you_reside'
                                                    )}
                                                    className="block px-5 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                            {errors.where_you_reside && (
                                                <div className="text-sm text-red-500">
                                                    {
                                                        errors.where_you_reside
                                                            .message
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <button
                                                type="submit"
                                                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                            >
                                                Purchase Ticket
                                            </button>
                                        </div>
                                    </form>
                                )}
                                {status === 'success' && (
                                    <div className="h-full w-full flex flex-col gap-8 text-center justify-center items-center text-green-600">
                                        <CheckCircleIcon
                                            height={80}
                                            width={80}
                                        />
                                        <p className="text-white text-xl">
                                            Payment was successfull. Please
                                            check your mail
                                        </p>
                                        <Button
                                            className="bg-green-600"
                                            onClick={() => {
                                                router.push(
                                                    'https://rcs.encryptedge.in'
                                                )
                                            }}
                                            size={'full'}
                                        >
                                            Go Back To Home Page
                                        </Button>
                                    </div>
                                )}
                                {status === 'error' && (
                                    <div className="h-full w-full flex flex-col gap-8 text-center justify-center items-center text-red-600">
                                        <XCircleIcon height={80} width={80} />
                                        <p className="text-white text-xl">
                                            Payment was unsuccessfull. Please
                                            try again.
                                        </p>
                                        <Button
                                            onClick={() => {
                                                router.replace(
                                                    'https://rcs.encryptedge.in'
                                                )
                                            }}
                                            size={'full'}
                                        >
                                            Go Back To Home Page
                                        </Button>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
