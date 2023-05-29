import { OutlinedInput } from "@mui/material";
import styled from "styled-components";
import { grey, lightGrey, red } from "../../theme/theme";

export const CustomOutlinedInput = styled(OutlinedInput)`
   &.MuiOutlinedInput-root {
      border: 1px solid ${lightGrey};
      border-radius: 0 4px 4px 0;
      color: ${grey};
      z-index: -1;
      padding: 15px 0;
   }
   &.Mui-error {
      border: 2px solid ${red};
      color: ${grey};
   }
`