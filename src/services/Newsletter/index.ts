import { strapiClient } from 'services/strapiClient';
import { NewsletterCreatePayload } from './type';

export const getNewsletterService = async (queryText: string) => {
  const { data, error, meta } = await strapiClient
    .from(`storages${queryText ? `?${queryText}` : ''}`)
    .select()
    .get();
  if (error) {
    return { error };
  } else {
    return { data, meta };
  }
};

export const getNewsletterDetailService = async (id: number) => {
  const { data, error, meta } = await strapiClient.from(`storages/${id}`).select().get();
  if (error) {
    return { error };
  } else {
    return { data, meta };
  }
};

export const createNewsletterService = async (formData: NewsletterCreatePayload) => {
  const { data, error, meta } = await strapiClient.from(`storages`).create({ ...formData });

  if (error) {
    return { error };
  } else {
    return { data, meta };
  }
};

export const deleteNewsletterService = async (id: number) => {
  const { data, error, meta } = await strapiClient.from(`storages`).deleteOne(id);

  if (error) {
    return { error };
  } else {
    return { data, meta };
  }
};

export const updateNewsletterService = async (id: number, formData: NewsletterCreatePayload) => {
  const { data, error, meta } = await strapiClient.from(`storages`).update(id, { ...formData });

  if (error) {
    return { error };
  } else {
    return { data, meta };
  }
};
