// authFetch.js

const getRefreshTokenFromCookies = () => {
    const cookies = document.cookie.split(';');
    const refreshTokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='));
    if (refreshTokenCookie) {
        return refreshTokenCookie.split('=')[1];
    }
    return null;
};

export const refreshToken = async () => {
    const refreshTokenValue = getRefreshTokenFromCookies();
    if (!refreshTokenValue) {
        console.error("Refresh token not found in cookies.");
        return false;
    }

    console.log("Attempting to refresh token with refreshToken:", refreshTokenValue);

    const response = await fetch('http://localhost:8080/api/v1/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log("Token refreshed successfully:", data);

        // Обновляем cookies с новыми токенами
        document.cookie = `accessToken=${data.accessToken}; path=/`;
        document.cookie = `refreshToken=${data.refreshToken}; path=/`;

        return true;
    } else {
        console.error('Failed to refresh token:', response.status);
        return false;
    }
};


export default async function fetchWithAuth(url, options) {
    let response = await fetch(url, options);

    if (response.status === 401) {
        console.warn('Received 401 Unauthorized. Attempting to refresh token.');
        const isRefreshed = await refreshToken();

        if (isRefreshed) {
            console.log('Token refreshed, retrying the original request.');
            response = await fetch(url, options); // Повторяем оригинальный запрос
        } else {
            console.error('Token refresh failed. Redirecting to login.');
            window.location.href = '/login';
        }
    }

    return response;
}
