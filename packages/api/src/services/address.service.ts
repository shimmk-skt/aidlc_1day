import { addressRepository } from '../repositories/address.repository.js';

export const addressService = {
  findByUser: (userId: number) => addressRepository.findByUser(userId),
  create: (userId: number, data: { label?: string; recipient_name: string; phone?: string; address_line1: string; address_line2?: string; city: string; postal_code: string; is_default?: boolean }) => addressRepository.create(userId, data),
  delete: (id: number, userId: number) => addressRepository.delete(id, userId),
};
