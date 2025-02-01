import {useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { IVFormErrors, VForm } from '../../shared/forms';
import * as yup from 'yup';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';

import { PessoasService } from "../../shared/services/pessoas/PessoasService";
import { AutoCompleteCidades } from './components/AutoCompleteCidades';
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts/LayoutBase";
import { VTextField, useVForm } from '../../shared/forms';

interface IFormData {
  email: string;
  cidadeId: number;
  nomeCompleto: string;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  nomeCompleto: yup.string().required('Campo é obrigatório.').min(3, 'O campo precisa ter pelo menos 3 caracteres.'),
  email: yup.string().required().email(),
  cidadeId: yup.number().required(),
});

export const DetalheDePessoas: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);

      PessoasService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/pessoas');
          } else {
            setNome(result.nomeCompleto);

            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        nomeCompleto: '',
        cidadeId: undefined,
        email: '',
      });
    }
  }, [id, navigate, formRef]);

  const handleSave = (dados: IFormData) => {

    formValidationSchema.validate(dados, { abortEarly: false })
    .then((dadosValidados: IFormData) => {
      if (id === 'nova') {
        PessoasService.create(dadosValidados)
          .then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate('/pessoas');
              } else {
                navigate(`/pessoas/detalhe/${result}`);
              }
            }
          });
      } else {
        setIsLoading(true);

        PessoasService.updateById(Number(id), { id: Number(id), ...dadosValidados })
          .then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert('result.message');
            } else {
                if(isSaveAndClose()) {
                  navigate('/pessoas');
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

  };

  const handleDelete = (id: number) => {
    if (window.confirm('Realmente deseja apagar?')) {
      PessoasService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message)
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/pessoas');
          }
        });
    }
  };

  return (
    <LayoutBase
      title={id === 'nova' ? 'Nova pessoa' : nome}
      BarraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Nova"
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}

          aoClicarEmVoltar={() => navigate('/pessoas')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmSalvar={save}
          aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
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
                name='nomeCompleto'
                label='Nome completo'
                disabled={isLoading}
                onChange={e => setNome(e.target.value)}
                />

              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={8} md={6} lg={4} xl={2}>

                <VTextField
                fullWidth
                name='email'
                label='Email'
                disabled={isLoading}
                />

              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={8} md={6} lg={4} xl={2}>
                <AutoCompleteCidades isExternalLoading={isLoading}/>
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
