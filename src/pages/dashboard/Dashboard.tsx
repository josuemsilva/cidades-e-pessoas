import { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

import { LayoutBase } from "../../shared/layouts/LayoutBase";
import { FerramentasDeListagem } from "../../shared/components";
import { CidadesService } from "../../shared/services/cidades/CidadesService";
import { PessoasService } from "../../shared/services/pessoas/PessoasService";

export const Dashboard = () => {
  const [isLoadingCidades, setIsLoadingCidades] = useState(true);
  const [totalCountCidades, setTotalCountCidades] = useState(0);

  const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);
  const [totalCountPessoas, setTotalCountPessoas] = useState(0);

  useEffect(() => {
    setIsLoadingCidades(true);
    setIsLoadingPessoas(true);

    CidadesService.getAll(1)
    .then((result)=> {
      setIsLoadingCidades(false);

      if(result instanceof Error) {
        alert(result.message);
        return;
      } else {
        setTotalCountCidades(result.totalCount);
      }
    });

    PessoasService.getAll(1)
    .then((result)=> {
      setIsLoadingPessoas(false);

      if(result instanceof Error) {
        alert(result.message);
        return;
      } else {
        setTotalCountPessoas(result.totalCount);
      }
    });
}, []);


  return (
    <LayoutBase
        title="Página inicial"
        BarraDeFerramentas={ <FerramentasDeListagem mostrarBotaoNovo={false} />}
    >
      <Box width="100%" display="flex">
        <Grid container margin={2}>
          <Grid item container spacing={2}>
            <Grid item xs={12} md={6} lg={4} xl={3}>

              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">
                    Total de Pessoas
                  </Typography>

                  <Box padding={6} display="flex" justifyContent="center" alignItems="center">
                    {!isLoadingPessoas && (
                      <Typography variant="h1">
                        {totalCountPessoas}
                      </Typography>
                    )}
                    {isLoadingPessoas && (
                      <Typography variant="h6">
                        Carregando...
                      </Typography>
                    )}

                  </Box>
                </CardContent>
              </Card>

            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={3}>

              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">
                    Total de Cidades
                  </Typography>

                  <Box padding={6} display="flex" justifyContent="center" alignItems="center">
                    {!isLoadingCidades && (
                      <Typography variant="h1">
                        {totalCountCidades}
                      </Typography>
                    )}
                    {isLoadingCidades && (
                      <Typography variant="h6">
                        Carregando...
                      </Typography>
                    )}

                  </Box>
                </CardContent>
              </Card>

            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBase>
  );
};