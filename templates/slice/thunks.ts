import { createEntityAdapter } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from 'store/hooks';
import { Sample } from 'services/Sample/type';
import { SampleService } from 'services/Sample';

export const getSampleList = createAppAsyncThunk<Sample[] | undefined, any>(
  `Sample/getSampleList`,
  async (filterOptions, { signal }) => {
    const response = await SampleService.getSamples({
      ...filterOptions,
      signal
    });

    return response.data;
  }
);

export const getSampleDetail = createAppAsyncThunk<Sample | undefined, string>(
  `Sample/getSampleDetail`,
  async (id, { signal }) => {
    const response = await SampleService.getSampleById({ id }, { signal });

    return response.data;
  }
);

export const removeSampleById = createAppAsyncThunk<string[] | undefined, string>(
  `Sample/removeSampleById`,
  async (id, { signal }) => {
    const response = await SampleService.deleteSampleById({ id }, { signal });

    return response.data;
  }
);

export const updateSample = createAppAsyncThunk<Sample | undefined, { form: any; id: string }>(
  `Sample/updateSample`,
  async ({ id, form }, { signal }) => {
    const response = await SampleService.updateSample(
      {
        sampleRequest: form,
        id
      },
      { signal }
    );
    return response.data;
  }
);

export const createSample = createAppAsyncThunk<Sample | undefined, any>(
  `Sample/createSample`,
  async (form, { signal }) => {
    const response = await SampleService.createSample(
      {
        sampleRequest: form
      },
      { signal }
    );
    return response.data;
  }
);

export const sampleAdapter = createEntityAdapter<Sample>({
  selectId: (value) => value.id || ''
});
