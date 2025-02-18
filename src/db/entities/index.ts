import Articles from 'src/db/entities/Articles'; 
import Users from 'src/db/entities/Users';
import Files from 'src/db/entities/Files';

const entities = [
    Articles,
    Users,
    Files
];

export default entities;

export { Articles, Users, Files };