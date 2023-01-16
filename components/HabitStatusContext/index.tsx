import React, { ReactNode, useContext } from 'react';
import { HabitStatusRecord, pocketbaseClient } from '../../utils';

const StatusContext = React.createContext<{
  data: HabitStatusRecord[];
  update: (
    id: string,
    params: { time: number; done: boolean }
  ) => Promise<void>;
  delete: (id: string) => Promise<void>;
  create: (params: { time: number; done: boolean }) => Promise<void>;
  getAll: (habit_id: string) => Promise<void>;
}>({
  data: [],
  async delete() {},
  async create() {},
  async update() {},
  async getAll() {},
});

export type StatusContextProviderProps = {
  children?: ReactNode;
};

export default function StatusContextProvider(
  props: StatusContextProviderProps
) {
  const statusContext = useContext(StatusContext);

  return (
    <StatusContext.Provider value={statusContext}>
      {props.children}
    </StatusContext.Provider>
  );
}
