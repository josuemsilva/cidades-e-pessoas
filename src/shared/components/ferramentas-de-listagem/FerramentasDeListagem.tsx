import { Box, Button, Icon, Paper, TextField, useTheme } from "@mui/material"

import { Environment } from "../../environment";


interface IFerramentasDeListagemProps {
  textoDaBusca?: string;
  mostrarInputBusca?: boolean;
  aoMudarTextoDeBusca?: (novoTexto: string) => void;
  textoBotaoNovo?: string;
  mostrarBotaoNovo?: boolean;
  aoClicarEmNovo?: () => void;
}

 export const FerramentasDeListagem:React.FC<IFerramentasDeListagemProps> = ({
  textoDaBusca = '',
  mostrarInputBusca = false,
  aoMudarTextoDeBusca,
  aoClicarEmNovo,
  textoBotaoNovo = 'Novo',
  mostrarBotaoNovo = true
 }) => {
  const theme = useTheme();
  return(
    <Box
    alignItems="center"
    gap={1}
    marginX={1}
    padding={1}
    paddingX={2}
    display="flex"
    height={theme.spacing(5)}
    component={Paper}>
      {mostrarInputBusca && (<TextField
      value={textoDaBusca}
      size="small"
      placeholder={Environment.INPUT_DE_BUSCA}
      onChange={(e) => aoMudarTextoDeBusca?.(e.target.value)}
      />)}

      <Box flex={1} display="flex" justifyContent="end">
      {mostrarBotaoNovo && (
        <Button
        disableElevation
        variant="contained"
        endIcon={<Icon>add</Icon>}
        onClick={aoClicarEmNovo}
        >{textoBotaoNovo}</Button>
      )}
      </Box>
    </Box>
  )
 }