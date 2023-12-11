import React from 'react';
import { Input, LegacyForms, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './datasource';
import { MyDataSourceOptions, MyQuery } from './shared/types';
import { useFetchSpaces } from 'shared/hooks/useFetchSpaces';
import './styles.css';
import { useFetchRooms } from 'shared/hooks/useFetchRooms';
import { useFetchContexts } from 'shared/hooks/useFetchContexts';
import { useFetchNodes } from 'shared/hooks/useFetchNodes';
import { Aggreagations, GroupByList, Methods } from 'shared/constants';
import { useFetchDimensions } from 'shared/hooks/useFetchDimensions';
import { Dropdown } from 'shared/types/dropdown.interface';
import PubSub from 'pubsub-js';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

const { FormField } = LegacyForms;

const QueryEditor: React.FC<Props> = ({ datasource, query, onChange, onRunQuery }) => {
  const { baseUrl } = datasource;
  const [selectedSpace, setSelectedSpace] = React.useState<Dropdown>();
  const [selectedRoom, setSelectedRoom] = React.useState<Dropdown>();
  const [selectedFilter, setSelectedFilter] = React.useState<Dropdown>();
  const [selectedFilterValue, setSelectedFilterValue] = React.useState<Dropdown>();
  const [totalInstances, setTotalInstances] = React.useState<number>(0);
  const [totalNodes, setTotalNodes] = React.useState<number>(0);

  const [selectedNodes, setSelectedNodes] = React.useState<SelectableValue<string[]>>();

  const [selectedContext, setSelectedContext] = React.useState<Dropdown>({
    label: query.contextId,
    value: query.contextId,
  });
  const [selectedDimensions, setSelectedDimensions] = React.useState<Dropdown[]>();
  const [selectedGroupBy, setSelectedGroupBy] = React.useState<Dropdown>(GroupByList[0]);
  const [selectedMethod, setSelectedMethod] = React.useState<Dropdown>(Methods[0]);
  const [selectedAggregations, setSelectedAggregations] = React.useState<Dropdown>(Aggreagations[0]);
  const [filterByValues, setFilterByValues] = React.useState<Dropdown[]>([]);

  const { spaces } = useFetchSpaces(baseUrl);
  const { rooms, fetchRooms } = useFetchRooms(baseUrl);
  const { nodes, fetchNodes } = useFetchNodes(baseUrl);
  const { contexts, fetchContexts } = useFetchContexts(baseUrl);
  const { allDimensions, groupingByList, filters, units, fetchDimensions } = useFetchDimensions(baseUrl);

  const filterList = React.useMemo(() => Object.keys(filters).map((s) => ({ label: s, value: s })), [filters]);
  const nodeList = React.useMemo(() => nodes?.map((c: any) => ({ label: c.name, value: c.id })), [nodes]);

  const { spaceId, roomId, nodes: allNodes, dimensions, groupBy, contextId, filterBy, filterValue } = query;

  const mySubscriber = (msg: any, data: any) => {
    setTotalNodes(data.data.nodes.length);
    setTotalInstances(data.data.nodes.reduce((acc: number, node: any) => acc + node.chartIDs.length, 0));
  };

  const isGroupFunctionAvailable = React.useCallback(() => {
    if (groupBy === 'instance' || selectedGroupBy?.value === 'instance') {
      return false;
    }
    if (totalInstances === 1) {
      return false;
    }
    if (groupBy === 'dimension' || selectedGroupBy?.value === 'dimension') {
      return true;
    }
    return totalInstances > 0 && totalInstances > totalNodes;
  }, [totalInstances, groupBy, totalNodes, selectedGroupBy]);

  React.useEffect(() => {
    PubSub.subscribe('CHART_DATA', mySubscriber);

    return () => {
      PubSub.unsubscribe(mySubscriber);
    };
  }, []);

  React.useEffect(() => {
    if (spaceId && spaces.length > 0) {
      const space = spaces.find((s) => s.value === spaceId);
      setSelectedSpace({ label: space?.label, value: space?.value });
      fetchRooms(spaceId);
    }
  }, [spaceId, spaces, fetchRooms]);

  React.useEffect(() => {
    if (roomId && rooms.length > 0) {
      const room = rooms.find((r) => r.value === roomId);
      setSelectedRoom({ label: room?.label, value: room?.value });
      fetchNodes(spaceId || '', roomId);
      fetchContexts(spaceId || '', roomId);
    }
  }, [roomId, rooms, fetchContexts, fetchNodes, spaceId]);

  React.useEffect(() => {
    // eslint-disable-line
    if (allNodes && nodes.length > 0) {
      const filteredNodes: any[] = [];
      allNodes.forEach((element) => {
        const currentNode: any = nodes.find((n: any) => n.id === element);
        filteredNodes.push({ label: currentNode?.name, value: currentNode?.id });
      });

      setSelectedNodes(filteredNodes);
    }
  }, [allNodes, nodes]); // eslint-disable-line

  React.useEffect(() => {
    if (contextId) {
      const filteredNodes: any[] = [];

      if (allNodes && nodes.length > 0) {
        allNodes.forEach((element) => {
          const currentNode: any = nodes.find((n: any) => n.id === element);
          filteredNodes.push({ label: currentNode?.name, value: currentNode?.id });
        });
      }

      fetchDimensions({ spaceId, roomId, contextId, nodeIDs: filteredNodes.map((n: any) => n.value) });
    }
  }, [contextId]); // eslint-disable-line

  React.useEffect(() => {
    if (dimensions && dimensions.length > 0) {
      const tempDimensions = dimensions.map((d: string) => ({ label: d, value: d }));

      setSelectedDimensions(tempDimensions);
    }

    if (groupBy) {
      setSelectedGroupBy({ label: groupBy, value: groupBy });
    }
  }, [dimensions, groupBy]);

  React.useEffect(() => {
    if (filters && filterBy && filterValue) {
      setSelectedFilter({ label: filterBy, value: filterBy });
      setSelectedFilterValue({ label: filterValue, value: filterValue });
    }
  }, [filterBy, filterValue, filters]);

  const onSpaceIdChange = (v: SelectableValue<string>) => {
    setSelectedSpace(v);

    // reset the rest of inputs
    setSelectedRoom({});
    setSelectedNodes([]);
    setSelectedContext({});
    setSelectedDimensions([]);
    setSelectedGroupBy(GroupByList[0]);
    setSelectedFilter({});
    setSelectedFilterValue({});
    setSelectedMethod(Methods[0]);
    setSelectedAggregations(Aggreagations[0]);

    fetchRooms(v.value || '');
    onChange({ ...query, spaceId: v.value });
    onRunQuery();
  };

  const onRoomIdChange = (v: SelectableValue<string>) => {
    setSelectedRoom(v);

    // reset the rest of inputs
    setSelectedNodes([]);
    setSelectedContext({});
    setSelectedDimensions([]);
    setSelectedGroupBy(GroupByList[0]);
    setSelectedFilter({});
    setSelectedFilterValue({});
    setSelectedMethod(Methods[0]);
    setSelectedAggregations(Aggreagations[0]);

    fetchContexts(selectedSpace?.value || '', v.value || '');
    fetchNodes(selectedSpace?.value || '', v.value || '');
    onChange({ ...query, spaceId: spaceId, roomId: v.value });
    onRunQuery();
  };

  const onContextIdChange = (v: SelectableValue<string>) => {
    setSelectedContext(v);

    // reset the rest of inputs
    setSelectedDimensions([]);
    setSelectedGroupBy(GroupByList[0]);
    setSelectedFilter({});
    setSelectedFilterValue({});
    setSelectedMethod(Methods[0]);
    setSelectedAggregations(Aggreagations[0]);

    fetchDimensions({ spaceId, roomId, contextId: v.value, nodeIDs: selectedNodes?.map((n: any) => n.value) || [] });
    onChange({ ...query, contextId: v.value });
    onRunQuery();
  };

  const onNodesChange = (v: SelectableValue<string[]>) => {
    const data = v.map((n: any) => n.value);

    // reset the rest of inputs
    setSelectedDimensions([]);
    setSelectedGroupBy(GroupByList[0]);
    setSelectedFilter({});
    setSelectedFilterValue({});
    setSelectedMethod(Methods[0]);
    setSelectedAggregations(Aggreagations[0]);

    fetchDimensions({ spaceId, roomId, contextId, nodeIDs: data });
    setSelectedNodes(data);
    onChange({ ...query, spaceId, roomId, contextId, nodes: data } as MyQuery);
    onRunQuery();
  };

  const onDimensionsChange = (v: SelectableValue<string[]>) => {
    const data = v.map((n: any) => n.value);
    setSelectedDimensions(data);
    onChange({ ...query, dimensions: data });
    onRunQuery();
  };

  const onGroupByChange = (v: SelectableValue<string>) => {
    setSelectedGroupBy(v);
    onChange({ ...query, groupBy: v.value });
    onRunQuery();
  };

  const onFilterByChange = (v: SelectableValue<string>) => {
    setSelectedFilter(v);

    if (v.value === 'No filter') {
      setSelectedFilterValue({});
      onChange({ ...query, filterBy: undefined, filterValue: undefined });
      onRunQuery();
    } else {
      setFilterByValues(filters[v?.value || ''].map((v) => ({ label: v, value: v })));
    }
  };

  const onFilterValueChange = (v: SelectableValue<string>) => {
    setSelectedFilterValue(v);
    onChange({ ...query, filterBy: selectedFilter?.value, filterValue: v.value });
    onRunQuery();
  };

  const onMethodChange = (v: SelectableValue<string>) => {
    setSelectedMethod(v);
    onChange({ ...query, method: v.value });
    onRunQuery();
  };

  const onAggreagationChange = (v: SelectableValue<string>) => {
    setSelectedAggregations(v);
    onChange({ ...query, group: v.value });
    onRunQuery();
  };

  return (
    <>
      <div className="flex mt">
        <FormField
          label="Space*"
          inputEl={
            <Select options={spaces} value={selectedSpace} onChange={onSpaceIdChange} allowCustomValue isSearchable />
          }
        />

        <FormField
          label="Room*"
          inputEl={
            <Select options={rooms} value={selectedRoom} onChange={onRoomIdChange} allowCustomValue isSearchable />
          }
        />
      </div>

      <div className="mt">
        <FormField
          label="Nodes"
          tooltip="No selected Nodes means 'All Nodes' from the Room"
          inputEl={
            <Select
              options={nodeList}
              value={selectedNodes}
              onChange={onNodesChange}
              allowCustomValue
              isSearchable
              isMulti
            />
          }
        />
      </div>
      <div className="flex mt">
        <FormField
          label="Context*"
          inputEl={
            <Select
              options={contexts}
              value={selectedContext}
              onChange={onContextIdChange}
              allowCustomValue
              isSearchable
            />
          }
        />

        <FormField
          label="Dimensions"
          inputEl={
            <Select
              options={allDimensions}
              value={selectedDimensions}
              onChange={onDimensionsChange}
              allowCustomValue
              isSearchable
              isMulti
            />
          }
        />
      </div>

      <div className="flex mt">
        <FormField
          label="Grouping by*"
          inputEl={
            <Select
              options={groupingByList}
              value={selectedGroupBy}
              onChange={onGroupByChange}
              allowCustomValue
              isSearchable
            />
          }
        />
        <FormField
          label="Grouping function*"
          tooltip="The aggregation function to be applied when multiple data sources exists for one node (multiple instances). This is disabled when not applicable."
          labelWidth={10}
          inputEl={
            <Select
              disabled={!isGroupFunctionAvailable()}
              options={Methods}
              value={selectedMethod}
              onChange={onMethodChange}
              allowCustomValue
              isSearchable
            />
          }
        />
        <FormField
          label="Aggregation function*"
          tooltip="Aggregation function over time"
          labelWidth={11}
          inputEl={
            <Select
              options={Aggreagations}
              value={selectedAggregations}
              onChange={onAggreagationChange}
              allowCustomValue
              isSearchable
            />
          }
        />
      </div>

      <div className="flex mt">
        <FormField
          label="Filter by"
          inputEl={
            <Select
              options={filterList}
              value={selectedFilter}
              onChange={onFilterByChange}
              allowCustomValue
              isSearchable
            />
          }
        />
        <FormField
          label="Value"
          labelWidth={8}
          inputEl={
            <Select
              options={filterByValues}
              value={selectedFilterValue}
              onChange={onFilterValueChange}
              allowCustomValue
              isSearchable
            />
          }
        />
      </div>

      <div className="flex mt">
        <FormField label="Unit" labelWidth={8} inputEl={<Input value={units} disabled />} />
        <div />
      </div>
    </>
  );
};

export { QueryEditor };
