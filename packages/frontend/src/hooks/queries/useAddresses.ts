import { useQuery } from '@tanstack/react-query';
import { fetchAddresses } from '../../api/addresses';

export const useAddresses = () => useQuery({ queryKey: ['addresses'], queryFn: fetchAddresses });
