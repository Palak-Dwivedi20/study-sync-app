
// const isProduction = process.env.NODE_ENV === 'production';

const options = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
}

export { options };