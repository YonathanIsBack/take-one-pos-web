import { Autocomplete, TextField } from '@mui/material';

interface CityOption {
  id: number;
  name: string;
}

interface DistrictOption {
  id: number;
  name: string;
}

interface SubDistrictOption {
  id: number;
  name: string;
  postCode: string | null;
}

export interface CustomerForm {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  fullTextAddress: string;
  cityId: number | null;
  districtId: number | null;
  subDistrictId: number | null;
}

interface CustomerFormFieldsProps {
  form: CustomerForm;
  setForm: (form: CustomerForm) => void;
  cities: CityOption[];
  districts: DistrictOption[];
  subDistricts: SubDistrictOption[];
  disabled: boolean;
}

function CustomerFormFields({
  form,
  setForm,
  cities,
  districts,
  subDistricts,
  disabled,
}: CustomerFormFieldsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <TextField
        fullWidth
        label="First Name"
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        disabled={disabled}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Middle Name"
        name="middleName"
        value={form.middleName}
        onChange={handleChange}
        disabled={disabled}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Last Name"
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        disabled={disabled}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Phone Number"
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleChange}
        disabled={disabled}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        disabled={disabled}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Address"
        name="fullTextAddress"
        value={form.fullTextAddress}
        onChange={handleChange}
        disabled={disabled}
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />
      <Autocomplete
        options={cities}
        getOptionLabel={(option) => option.name}
        value={cities.find((city) => city.id === form.cityId) ?? null}
        onChange={(_event, newValue) => setForm({ ...form, cityId: newValue?.id ?? null })}
        disabled={disabled}
        sx={{ mb: 2 }}
        renderInput={(params) => <TextField {...params} label="City" />}
      />
      <Autocomplete
        options={districts}
        getOptionLabel={(option) => option.name}
        value={districts.find((district) => district.id === form.districtId) ?? null}
        onChange={(_event, newValue) => setForm({ ...form, districtId: newValue?.id ?? null })}
        disabled={disabled}
        sx={{ mb: 2 }}
        renderInput={(params) => <TextField {...params} label="District" />}
      />
      <Autocomplete
        options={subDistricts}
        getOptionLabel={(option) => (option.postCode ? `${option.name} - ${option.postCode}` : option.name)}
        value={subDistricts.find((subDistrict) => subDistrict.id === form.subDistrictId) ?? null}
        onChange={(_event, newValue) => setForm({ ...form, subDistrictId: newValue?.id ?? null })}
        disabled={disabled}
        sx={{ mb: 2 }}
        renderInput={(params) => <TextField {...params} label="Sub District" />}
      />
    </>
  );
}

export default CustomerFormFields;
