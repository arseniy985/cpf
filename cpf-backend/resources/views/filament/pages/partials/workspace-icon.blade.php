@props([
    'name',
    'class' => '',
])

@switch($name)
    @case('inbox')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 13.5V6.75A2.25 2.25 0 0 1 6.25 4.5h11.5A2.25 2.25 0 0 1 20 6.75v6.75m-16 0h4.629a1.5 1.5 0 0 1 1.341.829l.38.76a1.5 1.5 0 0 0 1.342.83h.616a1.5 1.5 0 0 0 1.342-.83l.38-.76a1.5 1.5 0 0 1 1.341-.83H20m-16 0v2.25A2.25 2.25 0 0 0 6.25 18h11.5A2.25 2.25 0 0 0 20 15.75V13.5" />
        </svg>
        @break

    @case('warning')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 3.75h.008v.008H12v-.008ZM10.308 3.53 1.884 17.25A1.875 1.875 0 0 0 3.48 20.25h17.04a1.875 1.875 0 0 0 1.596-3L13.692 3.53a1.875 1.875 0 0 0-3.384 0Z" />
        </svg>
        @break

    @case('message')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 9h9m-9 3h5.25M6.75 18 3.75 20.25V6.75A2.25 2.25 0 0 1 6 4.5h12A2.25 2.25 0 0 1 20.25 6.75v8.5A2.25 2.25 0 0 1 18 17.5H8.157a2.25 2.25 0 0 0-1.407.5Z" />
        </svg>
        @break

    @case('arrow')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
        @break

    @case('checks')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 11.25 1.5 1.5L15 8.25m-6 7.5 1.5 1.5L15 12.75M6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 17.25V6.75A2.25 2.25 0 0 1 6.75 4.5Z" />
        </svg>
        @break

    @case('payments')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 10.5h16.5m-13.5 6h3m-6.75-9.75h16.5A1.5 1.5 0 0 1 21 8.25v7.5a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 15.75v-7.5a1.5 1.5 0 0 1 1.5-1.5Z" />
        </svg>
        @break

    @case('projects')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M5.25 21V7.5m4.5 13.5V3m4.5 18v-9m4.5 9V5.25" />
        </svg>
        @break

    @case('profile')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.5a7.5 7.5 0 0 1 15 0" />
        </svg>
        @break

    @case('document')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 3.75H6.75A2.25 2.25 0 0 0 4.5 6v12A2.25 2.25 0 0 0 6.75 20.25h10.5A2.25 2.25 0 0 0 19.5 18V7.5l-3.75-3.75ZM8.25 9.75h7.5m-7.5 3h7.5m-7.5 3h4.5" />
        </svg>
        @break

    @case('shield')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3.75c2.116 1.91 4.909 3 7.75 3v5.482c0 4.43-3.021 8.292-7.321 9.353a1.5 1.5 0 0 1-.858 0C7.271 20.524 4.25 16.662 4.25 12.232V6.75c2.841 0 5.634-1.09 7.75-3Zm-2.25 8.25 1.5 1.5 3-3" />
        </svg>
        @break

    @case('briefcase')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v.75m-10.5 2.25h15A1.5 1.5 0 0 1 21 10.5v6A1.5 1.5 0 0 1 19.5 18h-15A1.5 1.5 0 0 1 3 16.5v-6A1.5 1.5 0 0 1 4.5 9Zm0 0h15" />
        </svg>
        @break

    @case('deposit')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V6m0 0-4.5 4.5M12 6l4.5 4.5M4.5 18.75h15" />
        </svg>
        @break

    @case('withdrawal')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5v10.5m0 0-4.5-4.5M12 18l4.5-4.5M4.5 5.25h15" />
        </svg>
        @break

    @case('card')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 7.5h16.5M6.75 15.75h2.25m-5.25-8.25h16.5A1.5 1.5 0 0 1 21 9v6a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 15V9a1.5 1.5 0 0 1 1.5-1.5Z" />
        </svg>
        @break

    @case('round')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4.5 2.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        @break

    @case('globe')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3.75a8.25 8.25 0 1 0 0 16.5m0-16.5c2.071 2.248 3.375 5.497 3.375 8.25S14.071 18.002 12 20.25M12 3.75c-2.071 2.248-3.375 5.497-3.375 8.25S9.929 18.002 12 20.25M3.75 12h16.5" />
        </svg>
        @break

    @case('faq')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.008v.008H12V18Zm-1.5-9a2.25 2.25 0 1 1 3.19 2.05c-.908.436-1.69 1.138-1.69 2.2V14.25M12 3.75a8.25 8.25 0 1 0 8.25 8.25A8.25 8.25 0 0 0 12 3.75Z" />
        </svg>
        @break

    @case('leads')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.75a3 3 0 1 0-6 0m6 0v.75H12v-.75m6 0a6 6 0 1 0-12 0v.75h12v-.75ZM12 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
        @break

    @case('users')
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.5v-.75a3.75 3.75 0 0 0-7.5 0v.75m10.5.75v-.75a6 6 0 0 0-3.75-5.57M15.75 6a2.25 2.25 0 1 1 0 4.5M12 11.25A3 3 0 1 0 12 5.25a3 3 0 0 0 0 6Z" />
        </svg>
        @break

    @default
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="{{ $class }}" aria-hidden="true">
            <circle cx="12" cy="12" r="7.5" />
        </svg>
@endswitch
