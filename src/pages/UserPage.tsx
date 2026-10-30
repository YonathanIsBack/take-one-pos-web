import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TableData from '../commons/TableData';
import Title from '../commons/Title';
import RoutePath from '../constants/RoutePath';
import { User } from '../constants/Type';
import { API_USER, BASE_API_URL } from '../constants/Url';
import UserColumn from '../table-columns/UserColumns';

function UserPage() {
  const navigate = useNavigate();

  const handleDetail = (user: User) => {
    navigate(RoutePath.USER_DETAIL(user.id));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="User Management" />
      <Box sx={{ flex: 1, mt: 2, mx: 3, mb: 3, minHeight: 0 }}>
        <TableData<User>
          url={API_USER}
          columns={UserColumn}
          onDetail={handleDetail}
          auditTrailUrl={(user) => `${BASE_API_URL}/user/${user.id}/audit-trail`}
          dataKey="id"
          responseKey="users"
        />
      </Box>
    </Box>
  );
}

export default UserPage;
