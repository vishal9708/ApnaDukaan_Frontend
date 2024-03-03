import React from 'react';
import { useState, useEffect } from 'react';
import { AppBar, Stack, Box, CardMedia, Typography, Button } from '@mui/material';
import logo from '../Assets/images/logo.png';
import whiteLogo from '../Assets/images/logo.png'
import backgroungImg from '../Assets/images/Background.svg'
export const LoginLayout = ({
	LoginText,
	children,
	LoginIcon
}) => {

	return (
		<Stack
			sx={{
				minHeight: '100vh',
				background: `#f2f6f8 url(${backgroungImg})`,
				backgroundSize: 'cover',

			}}>
			<AppBar elevation={6} position='static' sx={{ bgcolor: 'transparent', height: "5rem", marginBottom: "1.5%" }}>
				<Box >
					<CardMedia
						component="img"
						src={logo}
						alt="Logo"
						sx={{ width: '200px', margin: "1rem 2rem" }}
					/>
				</Box>
			</AppBar>
			<Box
				component="main"
				sx={{
					flex: 1,
					display: 'grid',
					placeItems: 'center',
				}}>

				<Box
					sx={{
						bgcolor: 'grey.50',
						height: { xs: 'unset', sm: 'unset' },
						width: 'clamp(200px, 70%, 300px)',
						px: { xs: '25px', sm: '80px' },
						py: '50px',
						mb: 2,
						borderRadius: '10px',
						boxShadow: '0px 3.29214px 6.58427px rgba(27, 27, 27, 0.16)',
					}}>

					<Typography
						component="h1"
						variant="h5"
						sx={{
							fontFamily: 'Poppins, sans-serif',
							fontSize: 28,
							fontWeight: 500,
							color: 'primary.main',
							mb: '30px',
							textAlign: 'center',
						}}>

						{LoginText}

					</Typography>

					{children}

				</Box>

			</Box>

			<Footer />

		</Stack>

	);

};

export const Footer = () => {
	return (
		<Box
			component="footer"
			sx={{
				bgcolor: 'primary.main',
				display: 'flex',
				justifyContent: 'center',
				py: 1,
			}}>
			<Typography sx={{ color: 'common.white' }}>Powered By </Typography>
			<CardMedia
				component="img"
				src={whiteLogo}
				alt="kFintech Logo"
				sx={{ width: 'unset', ml: 1.5 }}
			/>
		</Box>
	);
};

export const OtpTimer = ({ onResend, type }) => {
	const [counter, setCounter] = useState(60);

	// Third Attempts
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
		return () => clearInterval(timer);
	}, [counter]);

	return (
		<Box>
			<Typography>
				<Button
					sx={{
						color: 'primary.main',
						mt: 1.5,
						fontSize: 14,
						fontWeight: 500,
						textTransform: 'capitalize',
						p: 0,
						':hover': {
							background: 'none',
						},
					}}
					disabled={counter > 0}
					onClick={() => {
						try {
							onResend(type);
							setCounter(60);
						} catch (e) {
							console.error((e).message);
						}
					}}>
					Resend OTP
				</Button>
				<br />
				{counter > 0 && `in ${counter} seconds`}
			</Typography>
		</Box>
	);
}
