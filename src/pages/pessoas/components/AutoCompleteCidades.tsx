import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState, useMemo } from "react";

import { useDebounce } from "../../../shared/hooks";
import { CidadesService } from "../../../shared/services/cidades/CidadesService";
import { useField } from "@unform/core";

type TAutoCompleteOption = {
  id: number;
  label: string;
}

interface IAutoCompleteCidadeProps {
  isExternalLoading?: boolean;
}

export const AutoCompleteCidades: React.FC<IAutoCompleteCidadeProps> = ({isExternalLoading = false}) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField('cidadeId');
  const {debounce} = useDebounce();

  const [selectedId, setSelectedId] = useState<number | undefined>(defaultValue);
  const [options, setOptions] = useState<TAutoCompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectedId,
      setValue: (_, newSelectedId) => setSelectedId(newSelectedId),
    });
  }, [registerField, fieldName, selectedId]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      console.log('busca:', busca);
      CidadesService.getAll(1, busca)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            return;
          } else {
            setOptions(result.data.map((cidade) => ({ id: cidade.id, label: cidade.nome })));
          }
        });
    });
  }, [busca, debounce]);


  const autoCompleteSelectedOption = useMemo(() => {
    if(!selectedId) return null;

    const selectedOption = options.find(option => option.id === selectedId);
    if(!selectedOption) return null;

    return selectedOption;
  }, [selectedId, options]);

  return (
    <Autocomplete
      openText="Abrir"
      closeText="Fechar"
      noOptionsText="Sem opções"
      loadingText="Carregando..."

      disablePortal

      options={options}
      loading={isLoading}
      disabled={isExternalLoading}
      value={autoCompleteSelectedOption}
      onInputChange={(_, newValue) => setBusca(newValue)}
      onChange={(_, newValue) => { setSelectedId(newValue?.id); setBusca(''); clearError()}}
      popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28}/> : undefined}
      renderInput={(params) => (
          <TextField
            {...params}
            error={!!error}
            helperText={error}

            label="Cidade"
        />
      )}
    />
  );
};
