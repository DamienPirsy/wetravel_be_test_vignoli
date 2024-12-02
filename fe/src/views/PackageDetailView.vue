<template>
    <div>
      <h1 class="text-2xl font-bold mb-4">Package selected: {{ pack?.name }}</h1>
      <p class="mb-2">{{ pack?.description }}</p>
      <p class="font-semibold">Price: {{ pack.price / 100 }} €</p>
      <p class="mb-4">Available seats: {{ pack?.freeSeats }}</p>
      <p class="mb-4">Valid through: {{ formatDate(pack?.startingDate) }} - {{ formatDate(pack?.endingDate) }}</p>
      <div class="mb-4">
        <input
          v-model="email"
          placeholder="Email"
          class="border p-2 w-full mb-2"
        />
        <input
          v-model.number="seats"
          type="number"
          placeholder="Posti"
          class="border p-2 w-full"
        />
      </div>
      <button
        :disabled="!canAddToCart"
        @click="addToCart"
        class="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Add to cart
      </button>
    </div>
  </template>
  
  <script>
  import { ref, watch,  computed } from "vue";
  import { useQuery, useMutation } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { useRoute, useRouter } from "vue-router";
  import { format } from 'date-fns';
  
  const GET_PACKAGE_BY_ID = gql`
    query GetPackageById($id: String!) {
      getPackageById(id: $id) {
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
      }
    }
  `;
  
  const ADD_TO_CART = gql`
    mutation AddToCart($cartRequest: CartRequestDto!) {
      addToCart(cartRequest: $cartRequest) {
        email
        seats
        userId
      }
    }
  `;
  
  export default {
    setup() {
      const route = useRoute();
      const router = useRouter();
  
      // default
      const email = ref("");
      const seats = ref(1);
      const pack = ref(route.params.id)
  

      const { result, loading, error } = useQuery(GET_PACKAGE_BY_ID, () => ({
        id: pack.value,
      }));

      watch(result, (newResult) => {
        if (newResult?.getPackageById) {
          pack.value = newResult.getPackageById;
        }
      });

      const { mutate } = useMutation(ADD_TO_CART);

      const canAddToCart = computed(() => {
        return pack.value && email.value && seats.value > 0 && seats.value <= pack.value.freeSeats;
      });

      const addToCart = async () => {
        try {
          await mutate({
            variables: {
              cartRequest: {
                email: email.value,
                packId: pack.value.id,
                seats: seats.value,
              },
            },
          });
          router.push("/cart");
        } catch (err) {
          console.error("Error adding to cart:", JSON.stringify(err));
        }
      }
    
      const formatDate = (date) => {
        if (!date) return '';
        return format(new Date(date), 'dd/MM/yyyy');
      }
  
      return {
        email,
        seats,
        pack,
        addToCart,
        formatDate,
        canAddToCart,
        loading,
        error,
      };
    },
  };
  </script>
  