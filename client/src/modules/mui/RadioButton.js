import { Radio } from "@mui/material";
import styled from "styled-components";
import { lightGrey } from "../../theme/theme";

export const CustomRadioButton = styled(Radio)`
   &.MuiRadio-root {
      color: ${lightGrey};
      height: 34px;
   }
   &.Mui-checked {
      color: #00bdd3;
   }
`