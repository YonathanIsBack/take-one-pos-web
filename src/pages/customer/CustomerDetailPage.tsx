import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TimeInformation from '../../commons/TimeInformation';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { API_CITY, API_CUSTOMER, API_DISTRICT, API_SUB_DISTRICT } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

interface CustomerDetail {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  fullTextAddress: string | null;
  cityId: number | null;
  districtId: number | null;
  subDistrictId: number | null;
  fullName: string;
  createdAt: string;
  updatedAt: string | null;
}

function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [cityName, setCityName] = useState('-');
  const [districtName, setDistrictName] = useState('-');
  const [subDistrictName, setSubDistrictName] = useState('-');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth(`${API_CUSTOMER}/${id}`)
      .then((response) => {
        if (response.status === 404) {
          navigate(RoutePath.CUSTOMER);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          const customerData = data.customer;
          setCustomer(customerData);
          if (customerData.cityId) {
            fetchWithAuth(`${API_CITY}/${customerData.cityId}`)
              .then((response) => response.json())
              .then((cityData) => setCityName(cityData.city?.name ?? '-'))
              .catch(() => {});
          }
          if (customerData.districtId) {
            fetchWithAuth(`${API_DISTRICT}/${customerData.districtId}`)
              .then((response) => response.json())
              .then((districtData) => setDistrictName(districtData.district?.name ?? '-'))
              .catch(() => {});
          }
          if (customerData.subDistrictId) {
            fetchWithAuth(`${API_SUB_DISTRICT}/${customerData.subDistrictId}`)
              .then((response) => response.json())
              .then((subDistrictData) => setSubDistrictName(subDistrictData.subDistrict?.name ?? '-'))
              .catch(() => {});
          }
          setLoading(false);
        }
      })
      .catch(() => {
        navigate(RoutePath.CUSTOMER);
      });
  }, [id, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Customer Detail" />
      <Box sx={{ p: 3 }}>
        {loading ? (
          <>
            <Skeleton variant="text" width="30%" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="25%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={30} />
          </>
        ) : (
          <>
            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Full Name
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {customer?.fullName}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Phone Number
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {customer?.phoneNumber || '-'}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Email
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {customer?.email || '-'}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Address
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
              {customer?.fullTextAddress || '-'}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              City
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {cityName}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              District
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {districtName}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Sub District
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {subDistrictName}
            </Typography>

            <TimeInformation
              createdAt={customer?.createdAt ?? ''}
              updatedAt={customer?.updatedAt ?? null}
            />
          </>
        )}
      </Box>
    </Box>
  );
}

export default CustomerDetailPage;
