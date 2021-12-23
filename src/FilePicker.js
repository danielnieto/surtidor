import Button from '@mui/material/Button';

import readXlsxFile from 'read-excel-file'

function FilePicker(props) {

    async function handleOnChange(event) {
        try {
            const rows = await readXlsxFile(event.target.files[0]);
            props.onChange(rows);
        } catch(err) {
            alert('Hubo un error al leer el archivo');
        }
    }

    return (
        <Button variant="contained" component="label">
            {props.label}
            <input type="file" onChange={handleOnChange} hidden accept='.xlsx, .xls'/>
        </Button>
    )
}


export default FilePicker;