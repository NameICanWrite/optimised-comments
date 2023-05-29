import { InputLabel } from "@mui/material";
import styled from "styled-components";
import { fontFamily, red } from "../../theme/theme";


export const CustomInputLabel = styled(InputLabel)`
   &.MuiInputLabel-root {
      font-family: ${fontFamily};
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
      line-height: 26px;
      padding: 14px 0;
      border: 1px solid rgba(0, 0, 0, 0.87);
      border-radius: 4px 0 0 4px;
      box-sizing: border-box;
      max-height: 54px;
      min-width: 81px;
   }
   &.Mui-error {
      border: 2px solid ${red};
   }
`