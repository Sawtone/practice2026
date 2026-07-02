import EventBus from './eventBus';

describe('EventBus 自动化测试', () => {
  let bus;

  // 每个测试开始前，都会重新初始化一个干净的 EventBus 实例
  beforeEach(() => {
    bus = new EventBus();
  });

  test('1. on 和 emit: 能够成功订阅并触发事件', () => {
    const mockFn = jest.fn();
    bus.on('test', mockFn);
    bus.emit('test', 'hello');

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('hello');
  });

  test('2. 多个订阅者: 同一个事件可以绑定多个不同的监听器', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    bus.on('multi', mockFn1);
    bus.on('multi', mockFn2);
    bus.emit('multi');

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  test('3. 多参数传递: emit 能够将多个参数完整传递给监听器', () => {
    const mockFn = jest.fn();
    bus.on('args_test', mockFn);
    bus.emit('args_test', 'arg1', 'arg2', { key: 'value' });

    // 断言传入了三个参数
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', { key: 'value' });
  });

  test('4. 容错性 - emit: 触发未订阅的事件不会报错', () => {
    // 只要代码不抛出 Error，这个测试就会通过
    expect(() => {
      bus.emit('unregistered_event');
    }).not.toThrow();
  });

  test('5. off: 能够成功取消特定的订阅', () => {
    const mockFn = jest.fn();
    bus.on('off_test', mockFn);
    bus.off('off_test', mockFn);
    bus.emit('off_test');

    // 断言该函数完全没有被调用
    expect(mockFn).not.toHaveBeenCalled();
  });

  test('6. off: 精准取消，不影响同一个事件的其他监听器', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    bus.on('off_specific', mockFn1);
    bus.on('off_specific', mockFn2);
    bus.off('off_specific', mockFn1); // 只取消 fn1
    bus.emit('off_specific');

    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  test('7. clean: 能够一键清空指定事件的所有订阅', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    bus.on('clean_test', mockFn1);
    bus.on('clean_test', mockFn2);
    bus.clean('clean_test'); // 清空该事件
    bus.emit('clean_test');

    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).not.toHaveBeenCalled();
  });

  test('8. 容错性 - clean 和 off: 操作未订阅的事件不会报错', () => {
    const mockFn = jest.fn();
    expect(() => {
      bus.clean('no_exist');
      bus.off('no_exist', mockFn);
    }).not.toThrow();
  });

  test('9. once: 绑定的监听器触发一次后会被自动移除', () => {
    const mockFn = jest.fn();
    bus.once('once_test', mockFn);

    bus.emit('once_test');
    bus.emit('once_test');
    bus.emit('once_test');

    // 虽然 emit 了 3 次，但监听器应该只执行 1 次
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('10. once 结合普通 on: once 被销毁时，不影响其他普通监听器', () => {
    const mockOnce = jest.fn();
    const mockNormal = jest.fn();

    bus.once('mixed_test', mockOnce);
    bus.on('mixed_test', mockNormal);

    bus.emit('mixed_test'); // 第一次：两个都执行
    bus.emit('mixed_test'); // 第二次：只有 normal 执行

    expect(mockOnce).toHaveBeenCalledTimes(1);
    expect(mockNormal).toHaveBeenCalledTimes(2);
  });
});
