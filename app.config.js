export default {
  extra: {
    apiUrl: process.env.DIPNO_API_HOST || 'http://localhost:8000',
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || 'yiY1DGCuMBiWTWMkP4mZDoksndxEUhJf6uDklbPq',
      clientSecret:
        process.env.FACEBOOK_CLIENT_SECRET ||
        'n5AIxbyK366tlCMrhXuYWx80x9MDlSWAgJ6pZxD4TpNwfS6xAepqabAnsF4u9QkN93QC6fNhHuxUAn2ljOWBh9gm7WCF2IWkI8T8w6jPj9nzD89UVynXTjd1sQARFHUq',
    },
  },
};
