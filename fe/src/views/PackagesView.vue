<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Choose your package</h1>
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-if="error" class="text-red-500">Error in fetching data</div>
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="pack in packages" :key="pack.id" class="p-4 border rounded shadow-md flex flex-col">
          <h2 class="text-xl font-semibold mb-2">{{ pack.name }}</h2>
          <p class="flex-grow">{{ pack.description }}</p> 
          <div class="mt-auto py-4">
            <p class="font-semibold">Price: {{ pack.price / 100 }} €</p>
            <p class="mb-4">Valid through: {{ formatDate(pack?.startingDate) }} - {{ formatDate(pack?.endingDate) }}</p>
            <button @click="viewPackage(pack.id)" class="bg-red-500 text-white px-4 py-2 rounded w-full my-2">
              Buy this package
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  
  <script>
  import { ref, watch } from 'vue';
  import { useQuery } from '@vue/apollo-composable';
  import gql from 'graphql-tag';
  import { format } from 'date-fns';

  const GET_ALL_PACKAGES = gql`
    query GetAllPackages {
        getAllPackages {
            createdAt
            deletedAt
            description
            endingDate
            freeSeats
            id
            maxSeats
            moods
            name
            price
            slug
            startingDate
            updatedAt
        }
    }
  `;
  
  export default {
  setup() {
    const packages = ref([]);
    const { loading, error, result } = useQuery(GET_ALL_PACKAGES);

    watch(result, (newResult) => {
      if (newResult && newResult.getAllPackages) {
        packages.value = newResult.getAllPackages;
      }
    });

    const formatDate = (date) => {
        if (!date) return '';
        return format(new Date(date), 'dd/MM/yyyy');
      }

    return {
      loading,
      error,
      packages,
      formatDate,
    };
  },
  methods: {
    viewPackage(id) {
      this.$router.push(`/package/${id}`);
    },
  },
};
  </script>
  