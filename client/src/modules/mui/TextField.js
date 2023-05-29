import { TextField } from "@mui/material";
import styled from "styled-components";
import { grey, lightGrey, red } from "../../theme/theme";

export const CustomTextField = styled(TextField)`
   & label.Mui-focused {
      color: ${grey}
   }
   & .MuiInput-underline:after {
      border-bottom-color: ${lightGrey}
   }
   & .MuiOutlinedInput-root {
      & fieldset {
         border-color: ${lightGrey}
      }
      &:hover fieldset {
         border-color: ${lightGrey}
      }
      &.Mui-error fieldset {
         border: 2px solid ${red}
      }
   }
`