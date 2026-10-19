'use client';

import React, { useState, useEffect, useCallback } from 'react';
import './calculator.css';

type StateType = 'first' | 'second' | 'operator' | 'result';
type OperatorType = '+' | '-' | '*' | '/' | '?';

export default function CalculatorPage() {
  const [state, setState] = useState<StateType>('first');
  const [display, setDisplay] = useState<string>('0');
  const [first, setFirst] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [operator, setOperator] = useState<OperatorType>('?');
  const [memory, setMemory] = useState<number>(0);
  const [activeOp, setActiveOp] = useState<string | null>(null);

  // จำกัดเเละปัดเศษรองรับทศนิยม8หลัก
  const roundResult = (num: number): number => {
    return parseFloat(num.toFixed(8));
  };

  // จัดรูปเเบบ
  const insertSeparator = (numStr: string, separator = ',', groupSize = 3): string => {
    if (numStr === 'Error' || numStr.toLowerCase().includes('e')) return numStr;

    let prefix = '';
    let str = numStr;
    if (str.startsWith('-')) {
      prefix = '-';
      str = str.substring(1);
    }
    let trailingDot = '';
    if (str.endsWith('.')) {
      trailingDot = '.';
      str = str.slice(0, -1);
    }
    let intPart = str;
    let decPart = '';
    if (str.includes('.')) {
      const parts = str.split('.');
      intPart = parts[0];
      decPart = '.' + parts[1];
    }
    let result = '';
    let counter = 0;
    for (let i = intPart.length - 1; i >= 0; i--) {
      result = intPart[i] + result;
      if (i !== 0 && counter % groupSize === groupSize - 1) {
        result = separator + result;
      }
      counter++;
    }
    return prefix + result + decPart + trailingDot;
  };

  // คำนวนตัวเลข
  const calculate = (a: number, op: OperatorType, b: number): number | 'Error' => {
    if (op === '+') return roundResult(a + b);
    if (op === '-') return roundResult(a - b);
    if (op === '*') return roundResult(a * b);
    if (op === '/') {
      if (b === 0) return 'Error';
      return roundResult(a / b);
    }
    return a;
  };

  // นับจำนวนตัวเลข
  const digitCount = (str: string): number => str.replace('-', '').replace('.', '').length;

  // operator ทำงานเมื่อ click
  const numberClick = useCallback((num: number | string) => {
    const numStr = String(num);

    setDisplay((prevDisplay) => {
      let curDisplay = prevDisplay;
      let curState = state;

      if (curDisplay === 'Error') {
        curDisplay = '0';
        curState = 'first';
        setState('first');
        setFirst(0);
        setSecond(0);
        setOperator('?');
        setActiveOp(null);
      }

      switch (curState) {
        case 'first':
        case 'second':
          if (digitCount(curDisplay) < 9) {
            if (curDisplay === '0') {
              return numStr;
            } else if (curDisplay === '-0') {
              return '-' + numStr;
            } else {
              return curDisplay + numStr;
            }
          }
          return curDisplay;
        case 'result':
          setState('first');
          return numStr;
        case 'operator':
          setState('second');
          return numStr;
        default:
          return curDisplay;
      }
    });
  }, [state]);

  const operatorClick = useCallback((op: '+' | '-' | '*' | '/') => {
    if (display === 'Error') return;

    const currentVal = Number(display);

    switch (state) {
      case 'first':
      case 'result':
        setFirst(currentVal);
        setOperator(op);
        setState('operator');
        setActiveOp(op);
        break;

      case 'operator':
        setOperator(op);
        setActiveOp(op);
        break;

      case 'second': {
        const res = calculate(first, operator, currentVal);
        const resStr = String(res);
        setDisplay(resStr);

        if (res !== 'Error') {
          setFirst(Number(resStr));
          setOperator(op);
          setState('operator');
          setActiveOp(op);
        } else {
          setState('result');
          setActiveOp(null);
        }
        break;
      }
    }
  }, [display, state, first, operator]);

  const equalClick = useCallback(() => {
    if (display === 'Error') return;

    if (state === 'second') {
      const currentVal = Number(display);
      const result = calculate(first, operator, currentVal);
      const resStr = String(result);
      setDisplay(resStr);
      if (result !== 'Error') {
        setFirst(Number(resStr));
      }
    }
    setState('result');
    setActiveOp(null);
  }, [display, state, first, operator]);

  const ceClick = useCallback(() => {
    const isAllClear = display === '0' || display === 'Error' || state === 'result';

    if (isAllClear) {
      setDisplay('0');
      setState('first');
      setFirst(0);
      setSecond(0);
      setOperator('?');
      setActiveOp(null);
    } else {
      setDisplay('0');
    }
  }, [display, state]);

  const mcClick = () => {
    setMemory(0);
  };

  const mrClick = () => {
    if (display === 'Error') return;

    setDisplay(String(memory));
    if (state === 'operator') {
      setState('second');
    } else {
      setFirst(memory);
      setState('result');
    }
  };

  const mPlusClick = () => {
    if (display === 'Error') return;
    setMemory((prev) => roundResult(prev + Number(display)));
    setState('result');
  };

  const mMinusClick = () => {
    if (display === 'Error') return;
    setMemory((prev) => roundResult(prev - Number(display)));
    setState('result');
  };

  const sqrtClick = () => {
    if (display === 'Error') return;
    const num = Number(display);
    if (num < 0) {
      setDisplay('Error');
      setState('result');
      setActiveOp(null);
    } else {
      const res = String(roundResult(Math.sqrt(num)));
      setDisplay(res);
      if (state === 'first' || state === 'result') {
        setFirst(Number(res));
        setState('first');
      }
    }
  };

  const percentClick = () => {
    if (display === 'Error') return;
    const res = String(roundResult(Number(display) / 100));
    setDisplay(res);
    if (state === 'first' || state === 'result') {
      setFirst(Number(res));
      setState('first');
    }
  };

  const reciprocalClick = () => {
    if (display === 'Error') return;
    const num = Number(display);
    if (num === 0) {
      setDisplay('Error');
      setState('result');
      setActiveOp(null);
    } else {
      const res = String(roundResult(1 / num));
      setDisplay(res);
      if (state === 'first' || state === 'result') {
        setFirst(Number(res));
        setState('first');
      }
    }
  };

  const dotClick = useCallback(() => {
    if (display === 'Error') return;

    if (state === 'operator') {
      setDisplay('0.');
      setState('second');
    } else if (state === 'result') {
      setDisplay('0.');
      setState('first');
    } else {
      if (!display.includes('.')) {
        setDisplay((prev) => prev + '.');
      }
    }
  }, [display, state]);

  const negClick = () => {
    if (display === 'Error') return;

    if (state === 'operator') {
      setDisplay('-0');
      setState('second');
      setActiveOp(null);
      return;
    }
    if (display !== '0') {
      if (display.startsWith('-')) {
        setDisplay(display.substring(1));
      } else {
        setDisplay('-' + display);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        equalClick();
      } else if (
        e.key === 'Escape' ||
        e.key === 'c' ||
        e.key === 'C' ||
        e.key === 'Delete' ||
        e.key === 'Backspace'
      ) {
        ceClick();
      } else if (e.key >= '0' && e.key <= '9') {
        numberClick(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        operatorClick(e.key as '+' | '-' | '*' | '/');
      } else if (e.key === '.') {
        dotClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [equalClick, ceClick, numberClick, operatorClick, dotClick]);

  const clearBtnText = display === '0' || display === 'Error' || state === 'result' ? 'CE' : 'C';

  return (
    <div className="calculator-body">
      <div className="calculator">
        <div className="outer">
          <div className="inner">
            <div className="screen" id="screen">
              {insertSeparator(display)}
            </div>
            <div className="btn-row">
              <button type="button" className="green" onClick={mcClick}>
                MC
              </button>
              <button
                type="button"
                className={`green ${memory !== 0 ? 'mr-active' : ''}`}
                onClick={mrClick}
              >
                MR
              </button>
              <button type="button" className="green" onClick={mPlusClick}>
                M+
              </button>
              <button type="button" className="green" onClick={mMinusClick}>
                M-
              </button>
              <button type="button" className="red" id="btn-clear" onClick={ceClick}>
                {clearBtnText}
              </button>
            </div>
            <div className="btn-row">
              <button type="button" className="purple" onClick={() => numberClick(7)}>
                7
              </button>
              <button type="button" className="purple" onClick={() => numberClick(8)}>
                8
              </button>
              <button type="button" className="purple" onClick={() => numberClick(9)}>
                9
              </button>
              <button
                type="button"
                className={`green ${activeOp === '/' ? 'active' : ''}`}
                id="op-/"
                onClick={() => operatorClick('/')}
              >
                &#247;
              </button>
              <button type="button" className="green" onClick={sqrtClick}>
                &#8730;
              </button>
            </div>
            <div className="btn-row">
              <button type="button" className="purple" onClick={() => numberClick(4)}>
                4
              </button>
              <button type="button" className="purple" onClick={() => numberClick(5)}>
                5
              </button>
              <button type="button" className="purple" onClick={() => numberClick(6)}>
                6
              </button>
              <button
                type="button"
                className={`green ${activeOp === '*' ? 'active' : ''}`}
                id="op-*"
                onClick={() => operatorClick('*')}
              >
                &#215;
              </button>
              <button type="button" className="green" onClick={percentClick}>
                %
              </button>
            </div>
            <div className="btn-row">
              <button type="button" className="purple" onClick={() => numberClick(1)}>
                1
              </button>
              <button type="button" className="purple" onClick={() => numberClick(2)}>
                2
              </button>
              <button type="button" className="purple" onClick={() => numberClick(3)}>
                3
              </button>
              <button
                type="button"
                className={`green ${activeOp === '-' ? 'active' : ''}`}
                id="op--"
                onClick={() => operatorClick('-')}
              >
                -
              </button>
              <button type="button" className="green" onClick={reciprocalClick}>
                1/x
              </button>
            </div>
            <div className="btn-row">
              <button type="button" className="purple" onClick={() => numberClick(0)}>
                0
              </button>
              <button type="button" className="purple" onClick={dotClick}>
                .
              </button>
              <button type="button" className="purple" onClick={negClick}>
                &#177;
              </button>
              <button
                type="button"
                className={`green ${activeOp === '+' ? 'active' : ''}`}
                id="op-+"
                onClick={() => operatorClick('+')}
              >
                +
              </button>
              <button type="button" className="green" onClick={equalClick}>
                =
              </button>
            </div>
          </div>
          <div className="student">
            68094495
            <br />
            นายอิทธิวรรธน์ ขุนพิชัย
          </div>
        </div>
      </div>
    </div>
  );
}