
import { createTheme, styled } from '@mui/material/styles';

export const fontFamily = '"Nunito", sans-serif';
export const lightGrey = '#d0cfcf'
export const grey = '#7e7e7e'
export const red = '#cb3d40'

export const Theme = createTheme({
   typography: {
      fontFamily: fontFamily,
      fontSize: 16,
      fontWeightRegular: 400,
      color: 'rgba(0, 0, 0, 0.87)',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '26px',
      subtitle1: {
         fontStyle: '"Nunito", sans-serif',
         fontWeight: 400,
         fontSize: 16,
         color: 'rgba(0, 0, 0, 0.87)',
      },
      body1: {
         fontStyle: '"Nunito", sans-serif',
         fontWeight: 400,
         fontSize: 16,
         color: 'rgba(0, 0, 0, 0.87)',
      },
      button: {
         fontStyle: '"Nunito", sans-serif',
         fontWeight: 400,
         fontSize: 16,
         color: 'rgba(0, 0, 0, 0.87)',
      },
   },
});

