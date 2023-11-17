interface ProfileData {
  age: string;
  name: string;
  createAt?: admin.firestore.Timestamp;
  id: string;
}

type formProps = {
    name?: string;
    age?: string;
  };