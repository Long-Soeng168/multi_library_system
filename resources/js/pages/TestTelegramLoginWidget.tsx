import { useEffect } from 'react';

export default function TelegramLogin() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;

        script.setAttribute('data-telegram-login', 'long_long_login_widget_bot');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '6');
        script.setAttribute('data-request-access', 'write');
        script.setAttribute('data-auth-url', 'https://jenise-unschismatic-susann.ngrok-free.dev/t-login/callback');

        // append directly inside the container
        document.getElementById('tg-login-container')?.appendChild(script);
    }, []);

    return (
        <div>
            <div
                id="tg-login-container"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px',
                }}
            />
            <div>Hello World</div>
        </div>
    );
}
