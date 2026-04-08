import { productRepository } from '../repositories/product.repository.js';
import { NotFoundError } from '../utils/errors.js';

export const productService = {
  findAll: () => productRepository.findAll(),
  findById: async (id: number) => {
    const p = await productRepository.findById(id);
    if (!p) throw new NotFoundError('Product');
    return p;
  },
  create: (data: { name: string; description: string; price: number; stock: number; image_url: string; category?: string }) => productRepository.create(data),
  update: async (id: number, data: { name: string; description: string; price: number; stock: number; image_url: string; category?: string }) => {
    const p = await productRepository.update(id, data);
    if (!p) throw new NotFoundError('Product');
    return p;
  },
  delete: (id: number) => productRepository.delete(id),
};
