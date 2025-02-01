import {useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { IVFormErrors, VForm } from '../../shared/forms';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import * as yup from 'yup';

import { CidadesService } from "../../shared/services/cidades/CidadesService";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts/LayoutBase";
import { VTextField, useVForm } from '../../shared/forms';

interface IFormData {
  nome: string;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  nome: yup.string().required().min(3),
});

export const DetalheDeCidades: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);

      CidadesService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/cidades');
          } else {
            setNome(result.nome);

            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        nome: '',
      });
    }
  }, [id, navigate, formRef]);

  const handleSave = (dados: IFormData) => {
    formValidationSchema.validate(dados, { abortEarly: false })
    .then((dadosValidados) => {
      if (id === 'nova') {
        CidadesService.create(dadosValidados)
          .then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate('/cidades');
              } else {
                navigate(`/cidades/detalhe/${result}`);
              }
            }
          });
      } else {
        setIsLoading(true);

        CidadesService.updateById(Number(id), { id: Number(id), ...dadosValidados })
          .then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert('result.message');
            } else {
                if(isSaveAndClose()) {
                  navigate('/cidades');
                }
            }
          });
      }
    })
    .catch((errors:yup.ValidationError) => {
      const validationErrors: IVFormErrors = {};

      errors.inner.forEach(error => {
        if(!error.path) return;

        validationErrors[error.path] = error.message;
      });
      formRef.current?.setErrors(validationErrors);

    });

    setIsLoading(true);

  };

  const handleDelete = (id: number) => {
    if (window.confirm('Realmente deseja apagar?')) {
      CidadesService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message)
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/cidades');
          }
        });
    }
  };

  return (
    <LayoutBase
      title={id === 'nova' ? 'Nova cidade' : nome}
      BarraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Nova"
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}

          aoClicarEmVoltar={() => navigate('/cidades')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmSalvar={save}
          aoClicarEmNovo={() => navigate('/cidades/detalhe/nova')}
          aoClicarEmSalvarEFechar={saveAndClose }
        />
      }
    >

      <VForm ref={formRef} onSubmit={handleSave}>
        <Box m={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
          <Grid container direction="column" p={2} spacing={2}>

            {isLoading && (
              <Grid>
                <LinearProgress variant='indeterminate'/>
              </Grid>
            )}

            <Grid item>
              <Typography variant='h6'>Geral</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={8} md={6} lg={4} xl={2}>

                <VTextField
                fullWidth
                name='nome'
                label='Nome'
                disabled={isLoading}
                onChange={e => setNome(e.target.value)}
                />

              </Grid>
            </Grid>
          </Grid>
          </Box>
        {/* {[1, 2, 3, 4].map((_, index)=> (
          <Scope key="" path={`endereco[${index}].rua`}>
            <VTextField name="rua" />
            <VTextField name="numero" />
            <VTextField name="estado" />
            <VTextField name="cidade" />
            <VTextField name="pais" />
          </Scope>
        ))} */}
      </VForm>
    </LayoutBase>
  );
};
